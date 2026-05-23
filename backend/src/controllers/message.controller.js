import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import cloudinary from "../services/cloudinary.js";
import { io, userSocketMap } from "../app.js";


// Send message to selected user
export const sendMessage = async (req, res) => {
    const text = req.body?.text || "";
    const image = req.file;
    const width = Number(req.body.width);
    const height = Number(req.body.height);



    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    if(!senderId || !receiverId){
        return res.status(400).json({
            success: false,
            message: "Sender and Receiver are required"
        });
    }

    if(!text && !image){
        return res.status(400).json({
            success: false,
            message: "Message must contain text or image"
        });
    }

    try{
        let imageUrl = null;
        let imagePublicId = null;

        if(image){
            const upload = await cloudinary.uploader.upload(image.path, {
                folder: "chat_images",
                resource_type: "image"
            });
            imageUrl = upload.secure_url;
            imagePublicId = upload.public_id;
        }

        const safeWidth = isNaN(width) ? null : width;
        const safeHeight = isNaN(height) ? null : height;

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            imageHeight: safeHeight,
            imageWidth: safeWidth,
            imagePublicId: imagePublicId,
        });

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
}

//Controller to delete a single message

export const deleteSingleMessage = async(req, res) => {
    const {messageId} = req.params;
    const senderId = req.user._id;

    if(!messageId){
        return res.status(400).json({
            success: false,
            message: "Message Id is required"
        });
    }

    try{
        const message = await messageModel.findById(messageId);

        if(!message){
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        if(message.senderId.toString() !== senderId.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this message"
            });
        }

        if(message.imagePublicId){
            await cloudinary.uploader.destroy(message.imagePublicId);
        }

        await message.deleteOne();

        const lastMessage = await messageModel.findOne({
                $or: [
                    { senderId: message.senderId, receiverId: message.receiverId },
                    { senderId: message.receiverId, receiverId: message.senderId }
                ]
            }).sort({ createdAt: -1 });

        const senderSocketId = userSocketMap[message.senderId];
        const receiverSocketId = userSocketMap[message.receiverId];

        if(senderSocketId){
            io.to(senderSocketId).emit("messageDeleted", {
                messageId,
                lastMessages: { [message.receiverId.toString()]: lastMessage || null }
            });
        }

        if(receiverSocketId){
            io.to(receiverSocketId).emit("messageDeleted", {
                messageId,
                lastMessages: { [message.senderId.toString()]: lastMessage || null }
            });
        }


        res.status(200).json({
            success: true,
            message: "Message deleted permanently"
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: error.message
        });
    }
}

/*
Get all user except the logged in user and count unseen messages
*/
export const getAllUser = async(req, res) => {
    const userId = req.user._id;

    try{
        const users = await userModel.find({_id: {$ne: userId}});

        const unseenMessages = {};
        const lastMessages ={};
        const promises = users.map(async (user) => {
            const messages = await messageModel.find({
                senderId: user._id,
                receiverId: userId,
                isViewed: false
            })
            if(messages.length > 0){
                unseenMessages[user._id.toString()] = messages.length;
            }

             // latest message
            const lastMessage = await messageModel.findOne({
                $or: [
                    { senderId: user._id, receiverId: userId },
                    { senderId: userId, receiverId: user._id }
                ]
            }).sort({ createdAt: -1 });

            if (lastMessage) {
                lastMessages[user._id.toString()] = lastMessage;
            }

        })
        await Promise.all(promises);

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
            unseenMessages,
            lastMessages
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

/*
Get all message for selected user
*/

export const getMessages = async(req, res) => {
    const {senderId} = req.params;
    const myId = req.user._id;

    if(!senderId){
        return res.status(400).json({
            success: false,
            message: "Sender Id is required"
        });
    }

    try{
        const messages = await messageModel.find({
            $or: [
                {senderId: senderId, receiverId: myId},
                {senderId: myId, receiverId: senderId}
            ]
        }).sort({createdAt: 1});

        await messageModel.updateMany(
            {
                senderId: senderId,
                receiverId: myId,
                isViewed: false
            },
            {
                isViewed: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            chatMessages: messages
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message
        });
    }
}

export const markMessagesSeen = async (req, res) => {
    const senderId = req.params.senderId;
    const myId = req.user._id;

    try {
        await messageModel.updateMany(
            {
                senderId,
                receiverId: myId,
                isViewed: false
            },
            {
                isViewed: true
            }
        );

        const senderSocketId = userSocketMap[senderId];

        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesViewed", {
                byUser: myId
            });
        }

        res.status(200).json({
            success: true,
            message: "Messages marked as seen"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};