import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "group",
        default: null
    },
    text: {
        type: String,
    },
    image:{
        type: String,
    },
    messageType:{
        type: String,
        enum:["user", "system"],
        required:[true,"Message Type is required"],
        default:"user"
    },
    systemAction: {
        type: String,
        enum: ["join","leave","add_member","remove_member","group_created","group_edited","chat_clear"]
    },
    imageHeight: {
        type: Number,
    },
    imageWidth: {
        type: Number,
    },
    imagePublicId:{
        type: String,
    },
    isViewed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const messageModel = mongoose.model("message", messageSchema);
export default messageModel;