import express from "express";
import "dotenv/config"
import http from "http";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import {Server} from "socket.io";
import groupRouter from "./routes/group.routes.js";
import groupMessageRouter from "./routes/groupMessage.routes.js";
import groupModel from "./models/group.model.js";

const app = express();
export const server = http.createServer(app);

export const io = new Server(server,{
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

//Stores online user {userId: socketId}
export const userSocketMap = {};

//Socket.io connection handler
io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    try{
        if(userId){
            userSocketMap[userId] = socket.id;
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        const groups = await groupModel.find({
            groupMembers: userId
        });

        groups.forEach((group) => {
            socket.join(group._id.toString());
        });

        console.log(`${userId} joined ${groups.length} groups`);

    }
    catch(error){
        console.log("Error in socket connection", error.message);
    }

    socket.on("joinGroup", (groupId) => {
        socket.join(groupId.toString());
        console.log(`${userId} joined group ${groupId.toString()}`);
    });

    socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId.toString());
        console.log(`${userId} left group ${groupId}`);
    });

    socket.on("call-user", ({to, offer, callerInfo}) => {
        const receiverSocketId = userSocketMap[to];
        if(!receiverSocketId){
            return;
        }
        io.to(receiverSocketId).emit("incoming-call", {
            from: userId,
            offer,
            callerInfo
        });
    });

    socket.on("call-accepted", ({to, answer}) => {
        const callerSocketId = userSocketMap[to];
        if(!callerSocketId){
            return
        }
        io.to(callerSocketId).emit("call-accepted", {
            answer
        });
    });

    socket.on("reject-call", ({to, rejectedBy}) => {
        const callerSocketId = userSocketMap[to];
        if(!callerSocketId){
            return;
        }
        io.to(callerSocketId).emit("call-rejected", {rejectedBy});
    });

    socket.on("ice-candidate", ({to, candidate}) => {
        const receiverSocketId = userSocketMap[to];
        if(!receiverSocketId){
            return;
        }
        io.to(receiverSocketId).emit("ice-candidate", {
            candidate
        });
    });

    socket.on("end-call", ({to, endedBy}) => {
        const receiverSocketId = userSocketMap[to];
        if(!receiverSocketId){
            return
        };
        io.to(receiverSocketId).emit("call-ended", {endedBy});
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

})


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: "5mb"}));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);
app.use("/api/group-messages", groupMessageRouter);

