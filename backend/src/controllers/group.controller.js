import groupModel from "../models/group.model.js";
import messageModel from "../models/message.model.js";
import cloudinary from "../services/cloudinary.js";
import { io, userSocketMap } from "../app.js";


// Controller for creating a new group.
export const createGroup = async (req, res) => {
    const adminId = req.user._id;
    const groupName = req.body.groupName;
    const groupDescription = req.body.groupDescription || "";
    const groupIcon = req.file;
    const groupMembers = req.body.groupMembers;

    const groupMembersArray = JSON.parse(groupMembers);

    if(!groupName || !groupMembers || groupMembersArray.length === 0){
        return res.status(400).json(
            {
                success: false,
                message: "Group name and members are required"
            }
        );
    }

    try {
        let groupIconUrl = null;
        let groupIconPublicId = null;

        if(groupIcon){
            const result = await cloudinary.uploader.upload(groupIcon.path, {
                folder: "chat-groups",
                resource_type: "image"
            });
            groupIconUrl = result.secure_url;
            groupIconPublicId = result.public_id;
        }


        const group = await groupModel.create({
            groupAdmin: adminId,
            groupName,
            groupDescription,
            groupIcon: groupIconUrl,
            groupIconPublicId,
            groupMembers: [...groupMembersArray, adminId]
        });

        const populatedGroup = await group.populate([
            {
                path: "groupAdmin",
                select: "fullName"
            },
            {
                path: "groupMembers",
                select: "fullName profilePhoto email"
            }
        ]);

        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "group_created",
            text: `${req.user.fullName} created this group`
        });

        group.groupMembers.forEach((member) => {
            const socketId = userSocketMap[member._id.toString()];
            if(socketId){
                io.to(socketId).emit("groupCreated", {
                    sysMsg,
                    group: populatedGroup
                });
            }
        });

        return res.status(201).json(
            {
                success: true,
                message: "Group created successfully",
                group: populatedGroup,
                sysMsg
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Failed to create group",
                error: error.message
            }
        );
    }

}

//Controller for getting all the groups and last message in the group.
export const getAllGroups = async (req, res) => {
    const userId = req.user._id;


    if(!userId){
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const groups = await groupModel.find().populate('groupMembers', 'fullName profilePhoto email').populate("groupAdmin", "fullName");

        let lastMessages = {};

        const promises = groups.map(async (group) => {
            const lastMessage = await messageModel.findOne({
                groupId: group._id
            }).populate("senderId", "fullName").sort({createdAt: -1});
            if(lastMessage){
                lastMessages[group._id] = lastMessage;
            }
        });

        await Promise.all(promises);

        return res.status(200).json({
            success: true,
            message: "Groups fetched successfully",
            groups,
            lastMessages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch groups",
            error: error.message
        });
    }
}

//Controller for getting groups in which user is member.
export const getUserGroups = async (req, res) => {
    const userId = req.user._id;

    if(!userId){
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const groups = await groupModel.find({
            groupMembers: userId
        }).populate('groupMembers', 'fullName profilePhoto email').populate("groupAdmin", "fullName");

        let lastMessages = {};
        let unseenMessages = {};

        const promises = groups.map(async (group) => {
            const lastMessage = await messageModel.findOne({
                groupId: group._id
            }).populate("senderId", "fullName").sort({createdAt: -1});
            if(lastMessage){
                lastMessages[group._id] = lastMessage;
            }

            const unseenMessagesCount = await messageModel.find({
                groupId: group._id,
                senderId: {$ne: userId},
                isViewed: false,
            });
            if(unseenMessagesCount.length > 0){
                unseenMessages[group._id] = unseenMessagesCount.length;
            }
        });

        await Promise.all(promises);

        return res.status(200).json({
            success: true,
            message: "Groups fetched successfully",
            groups,
            lastMessages,
            unseenMessages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch groups",
            error: error.message
        });
    }
}

// Controller for updating a group (name, description, icon).
export const updateGroup = async (req, res) => {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const groupName = req.body.groupName;
    const groupDescription = req.body.groupDescription;
    const groupIcon = req.file;

    if(!groupName && !groupDescription && !groupIcon){
        return res.status(400).json(
            {
                success: false,
                message: "Nothing to update in group"
            }
        );
    }

    try{
        const group = await groupModel.findById(groupId).populate('groupAdmin', 'fullName').populate('groupMembers', 'fullName profilePhoto email');

        if(!group){
            return res.status(404).json(
                {
                    success: false,
                    message: "Group not found"
                }
            );
        }

        const adminId = group.groupAdmin._id;

        if(adminId.toString() !== userId.toString()){
            return res.status(403).json(
                {
                    success: false,
                    message: "Only admin can update the group"
                }
            );
        }

        if(groupName){
            group.groupName = groupName;
        }

        if(groupDescription){
            group.groupDescription = groupDescription;
        }

        if(groupIcon){
            // Destroying the previous group icon if exists
            if(group.groupIconPublicId){
                await cloudinary.uploader.destroy(group.groupIconPublicId);
            }
            // Uploading the new group icon
            const result = await cloudinary.uploader.upload(groupIcon.path, {
                folder: "chat-groups",
                resource_type: "image"
            });
            group.groupIcon = result.secure_url;
            group.groupIconPublicId = result.public_id;
        }

        await group.save();

        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "group_edited",
            text: `${group.groupAdmin.fullName} edited the group`
        });

        io.to(group._id.toString()).emit("groupUpdated", {
            groupId: group._id,
            group,
            sysMsg
        });

        return res.status(200).json(
            {
                success: true,
                message: "Group updated successfully",
                group,
                sysMsg
            }
        );

    }
    catch(error){
        return res.status(500).json(
            {
                success: false,
                message: "Failed to update group",
                error: error.message
            }
        );
    }

}


//Controller for deleting a group (all messages along with cloudinary images will be deleted too).
export const deleteGroup = async (req, res) => {
    const userId = req.user._id;
    const groupId = req.params.groupId;

    try{
        const group = await groupModel.findById(groupId);

        if(!group){
            return res.status(404).json(
                {
                    success: false,
                    message: "Group not found"
                }
            );
        }

        const adminId = group.groupAdmin;

        if(adminId.toString() !== userId.toString()){
            return res.status(403).json(
                {
                    success: false,
                    message: "Only admin can delete the group"
                }
            );
        }

        // deleting group icon from cloudinary if exists

        if(group.groupIconPublicId){
            await cloudinary.uploader.destroy(group.groupIconPublicId);
        }

        // Find all group messages to delete them
        const groupMessages = await messageModel.find({ group: groupId });

        if(groupMessages.length > 0){
            for(const message of groupMessages){
                if(message.image){
                    await cloudinary.uploader.destroy(message.imagePublicId);
                }
            }
            await messageModel.deleteMany({ groupId: groupId });
        }

        await group.deleteOne();

        return res.status(200).json(
            {
                success: true,
                message: "Group deleted successfully"
            }
        );
    }
    catch(error){
        return res.status(500).json(
            {
                success: false,
                message: "Failed to delete group",
                error: error.message
            }
        );
    }
}

//Controller for adding a member (single or multiple) in group by the admin.
export const addMemberToGroup = async (req, res) => {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const members = req.body.members;

    if(!groupId || !members){
        return res.status(400).json(
            {
                success: false,
                message: "Group Id and members are required"
            }
        );
    }

    try{
        const group = await groupModel.findById(groupId).populate('groupAdmin', 'fullName');

        if(!group){
            return res.status(404).json(
                {
                    success: false,
                    message: "Group not found"
                }
            );
        }

        const adminId = group.groupAdmin._id;

        if(adminId.toString() !== userId.toString()){
            return res.status(403).json(
                {
                    success: false,
                    message: "Only admin can add members to the group"
                }
            );
        }

        const updatedGroup = await groupModel.findByIdAndUpdate(groupId,{
            $addToSet:{
                groupMembers: {
                    $each: members
                }
            }
        },{
            new: true
        }).populate('groupMembers', 'fullName profilePhoto email');

        const addedMember = updatedGroup.groupMembers.filter((member)=> members.includes(member._id.toString()));

        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "add_member",
            text: `${group.groupAdmin.fullName} added ${addedMember.map((member)=>member.fullName).join(", ")} to the group`
        });

        updatedGroup.groupMembers.forEach(member => {
            const socketId = userSocketMap[member._id.toString()];
            if(socketId){
                io.to(socketId).emit("groupMemberAdded", {
                    group : updatedGroup,
                    groupMembers: updatedGroup.groupMembers,
                    sysMsg
                });
            }
        });

        return res.status(200).json(
            {
                success: true,
                message: "Members added successfully",
                group: updatedGroup,
                sysMsg
            }
        );
    }
    catch(error){
        return res.status(500).json(
            {
                success: false,
                message: "Failed to add members",
                error: error.message,
            }
        );
    }

}


//Controller for removing member (single or multiple) from group by the admin.
export const removeMemberFromGroup = async (req, res) => {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const members = req.body.members;

    if(!groupId || !members){
        return res.status(400).json(
            {
                success: false,
                message: "Group Id and members are required"
            }
        );
    }

    try{
        const group = await groupModel.findById(groupId).populate('groupAdmin', 'fullName').populate('groupMembers', 'fullName');

        if(!group){
            return res.status(404).json(
                {
                    success: false,
                    message: "Group not found"
                }
            );
        }

        const removedMember = group.groupMembers.filter((member)=> members.includes(member._id.toString()));

        const adminId = group.groupAdmin._id;

        if(adminId.toString() !== userId.toString()){
            return res.status(403).json(
                {
                    success: false,
                    message: "Only admin can remove members from the group"
                }
            );
        }

        const updatedGroup = await groupModel.findByIdAndUpdate(groupId,{
            $pull:{
                groupMembers: {
                    $in: members
                }
            }
        },{
            new: true
        }).populate('groupMembers', 'fullName email profilePhoto');


        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "remove_member",
            text: `${group.groupAdmin.fullName} removed ${removedMember.map((member)=>member.fullName).join(", ")} from the group`
        });

        io.to(groupId).emit("groupMemberRemoved", {
            groupId,
            memberId: members,
            sysMsg,
            groupMembers: updatedGroup.groupMembers
        });

        return res.status(200).json(
            {
                success: true,
                message: "Members removed successfully",
                group: updatedGroup,
                sysMsg
            }
        );
    }
    catch(error){
        return res.status(500).json(
            {
                success: false,
                message: "Failed to remove members",
                error: error.message
            }
        );
    }
}

//Controller for joining a group (admin access doesn't required)
export const joinGroup = async (req, res) => {
    const userId = req.user._id;
    const groupId = req.params.groupId;

    if(!groupId){
        return res.status(400).json(
            {
                success: false,
                message: "Group Id is required"
            }
        );
    }

    try{
        const group = await groupModel.findById(groupId);

        if(!group){
            return res.status(404).json(
                {
                    success: false,
                    message: "Group not found"
                }
            );
        }

        if(group.groupMembers.includes(userId)){
            return res.status(400).json(
                {
                    success: false,
                    message: "You are already a member of this group"
                }
            );
        }

        const updatedGroup = await groupModel.findByIdAndUpdate(groupId,{
            $addToSet:{
                groupMembers: userId
            }
        },{
            new: true
        }).populate('groupMembers', 'fullName email profilePhoto');

        const memberJoined = updatedGroup.groupMembers.find((member) => member._id.toString() === userId.toString());

        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "join",
            text: `${memberJoined.fullName} joined the group`
        });

        updatedGroup.groupMembers.forEach((member) => {
            const socketId = userSocketMap[member._id.toString()];
            if(socketId){
                io.to(socketId).emit("userJoinedGroup", {
                    groupId,
                    groupMembers: updatedGroup.groupMembers,
                    sysMsg
                });
            }
        });

        return res.status(200).json(
            {
                success: true,
                message: "Joined group successfully",
                group: updatedGroup,
                sysMsg
            }
        );
    }
    catch(error){
        return res.status(500).json(
            {
                success: false,
                message: "Failed to join group",
                error: error.message
            }
        );
    }
}

//Controller for leaving a group (admin access doesn't required) and admin can't leave group.
export const leaveGroup = async (req, res) => {
    const userId = req.user._id;
    const groupId = req.params.groupId;

    if(!groupId){
        return res.status(400).json(
            {
                success: false,
                message: "Group Id is required"
            }
        );
    }

    try{
        const group = await groupModel.findById(groupId).populate('groupMembers', 'fullName');

        if(!group){
            return res.status(404).json(
                {
                    success: false,
                    message: "Group not found"
                }
            );
        }

        const memberLeft = group.groupMembers.find((member) => member._id.toString() === userId.toString());


        const isMember = group.groupMembers.some(
            (member) => member._id.toString() === userId.toString()
        );

        if(!isMember){
            return res.status(400).json(
                {
                    success: false,
                    message: "You are not a member of this group"
                }
            );
        }

        if(group.groupAdmin.toString() === userId.toString()){
            return res.status(403).json(
                {
                    success: false,
                    message: "Admin cannot leave the group"
                }
            );
        }

        const updatedGroup = await groupModel.findByIdAndUpdate(groupId,{
            $pull:{
                groupMembers: userId
            }
        },{
            new: true
        }).populate('groupMembers', 'fullName email profilePhoto');

        const sysMsg = await messageModel.create({
            groupId: group._id,
            messageType: "system",
            systemAction: "leave",
            text: `${memberLeft.fullName} left the group`
        });

        io.to(groupId).emit("userLeftGroup", {
            groupId,
            groupMembers: updatedGroup.groupMembers,
            sysMsg,
            memberLeft
        });

        return res.status(200).json(
            {
                success: true,
                message: "Group left successfully",
                group: updatedGroup,
                sysMsg
            }
        );
    }
    catch(error){
        return res.status(500).json(
            {
                success: false,
                message: "Failed to leave group",
                error: error.message
            }
        );
    }
}


