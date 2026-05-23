import messageModel from "../models/message.model.js";
import groupModel from "../models/group.model.js";
import userModel from "../models/user.model.js";
import cloudinary from "../services/cloudinary.js";
import { io } from "../app.js";

//Controller for sending a message to a group.
export const sendGroupMessage = async (req, res) => {
    const groupId = req.params.groupId;
    const senderId = req.user._id;
    const text = req.body?.text || "";
    const image = req.file;
    const width = Number(req.body.width);
    const height = Number(req.body.height);

    if(!groupId){
        return res.status(400).json({
            success: false,
            message: "Group Id is required"
        });
    }

    if(!text && !image){
        return res.status(400).json({
            success: false,
            message: "Message text or image is required"
        });
    }

    //Upload image to cloudinary if provided.
    try{
        let imageSecureUrl = null;
        let imagePublicId = null;
        if(image){
            const result = await cloudinary.uploader.upload(image.path, {
                folder: "group-messages",
                resource_type: "image",
            });
            imageSecureUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const safeWidth = isNaN(width) ? null : width;
        const safeHeight = isNaN(height) ? null : height;

        const newGroupMessage = await messageModel.create({
            senderId,
            groupId,
            text,
            image: imageSecureUrl,
            imagePublicId,
            imageWidth: safeWidth,
            imageHeight: safeHeight
        });

        const populatedMessage = await messageModel.findById(newGroupMessage._id).populate("senderId", "fullName profilePhoto");

        io.to(groupId).emit("receiveGroupMessage", populatedMessage);

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            groupMessage: populatedMessage
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to send group message",
            error: error.message
        });
    }
}

//Controller for fetching all messages of a group.
export const getGroupMessages = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    if(!groupId){
        return res.status(400).json({
            success: false,
            message: "Group Id is required"
        });
    }
    try{
        const group = await groupModel.findOne({
            _id: groupId,
            groupMembers: userId
        });

        if(!group){
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        const allMessages = await messageModel.find({
            groupId
        }).sort({ createdAt: 1 }).populate("senderId", "fullName profilePhoto");

        const messageToUpdate = await messageModel.find({
            groupId,
            isViewed: false,
            senderId: { $ne: userId }
        });

        await messageModel.updateMany({
            groupId,
            isViewed: false,
            senderId: { $ne: userId }
        },{
            isViewed: true
        });

        const updatedMessageIds = messageToUpdate.map(
            (message) => message._id
        );

        io.to(groupId).emit("markGroupMessageSeen", {
            updatedMessageIds,
            groupId
        });

        res.status(200).json({
            success: true,
            message: "Group messages fetched successfully",
            allMessages
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch group messages",
            error: error.message
        });
    }
}

//Controller for deleting a message from a group.
export const deleteGroupMessage = async (req, res) => {
    const messageId = req.params.messageId;
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

        const groupId = message.groupId.toString();

        await message.deleteOne();

        const lastMessage = await messageModel.findOne({
            groupId
        }).sort({ createdAt: -1 }).populate("senderId", "fullName profilePhoto");

        io.to(groupId).emit("deleteGroupMessage", {
            messageId,
            groupId,
            lastMessage: lastMessage || null
        });

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
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

//Controller for deleting entire chat (clear chat) from a group (admin access needed).
export const clearGroupChat = async (req, res) => {
    const groupId = req.params.groupId;
    const senderId = req.user._id;

    if(!groupId){
        return res.status(400).json({
            success: false,
            message: "Group Id is required"
        });
    }

    try{
        const group = await groupModel.findById(groupId).populate("groupAdmin", "fullName");

        if(!group){
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        const adminId = group.groupAdmin._id;

        if(adminId.toString() !== senderId.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to clear this group chat"
            });
        }

        const groupMessages = await messageModel.find({ groupId: groupId });
        if(groupMessages.length > 0){
            await Promise.all(
                groupMessages.map((message) => {
                    if(message.imagePublicId){
                        return cloudinary.uploader.destroy(message.imagePublicId);
                    }
                })
            );
            await messageModel.deleteMany({ groupId: groupId });
        }

        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "chat_clear",
            text: `${group.groupAdmin.fullName} cleared the group chat`
        });
        io.to(groupId).emit("clearGroupChat", { groupMessages: [sysMsg], sysMsg, groupId });

        res.status(200).json({
            success: true,
            message: "Group chat cleared successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to clear group chat",
            error: error.message
        });
    }
}

//Controller to get all users for adding them to a group (except for the logged in user).
export const getAllUsersForGroup = async (req, res) => {
    try{
        const users = await userModel.find({
            _id: { $ne: req.user._id }
        }).select("fullName email profilePhoto");

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });
    }
    catch(error){

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

//Controller to mark group messages seen.
export const markGroupMessageSeen = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    if(!groupId){
        return res.status(400).json({
            success: false,
            message: "Group Id is required"
        });
    }


    try{
        const group = await groupModel.findById(groupId);
        if(!group){
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }
        const isMember = group.groupMembers.some((memberId) => memberId.toString() === userId.toString());

        if(!isMember){
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            });
        }
        const messageToUpdate = await messageModel.find({
            groupId,
            isViewed: false,
            senderId: { $ne: userId }
        });

        await messageModel.updateMany({
            groupId,
            isViewed: false,
            senderId: { $ne: userId }
        },{
            isViewed: true
        });

        const updatedMessageIds = messageToUpdate.map((message) => message._id);

        io.to(groupId).emit("markGroupMessageSeen", {updatedMessageIds, groupId});

        res.status(200).json({
            success: true,
            message: "Messages marked as seen successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to mark messages as seen",
            error: error.message
        });
    }
}