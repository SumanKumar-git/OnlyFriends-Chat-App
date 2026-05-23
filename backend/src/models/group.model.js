import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName:{
        type: String,
        required: [true, "Group name is required"]
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Group Admin is required"]
    },
    groupMembers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    groupIcon:{
        type: String
    },
    groupIconPublicId:{
        type: String
    },
    groupDescription:{
        type: String
    }
},{timestamps:true})

const groupModel = mongoose.model("group", groupSchema);
export default groupModel;