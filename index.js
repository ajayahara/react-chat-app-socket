const { Server } = require("socket.io");
const io = new Server({ cors: "https://64f80886b409573932a11602--peppy-starlight-842ad9.netlify.app" });
let onlineUser = [];
io.on("connection", (socket) => {
    socket.on("addNewUser", (userId) => {
        if (!onlineUser.some((user) => user.userId == userId)) {
            onlineUser.push({
                userId:userId,
                socketId: socket.id
            })
        }
        io.emit("getOnlineUser", onlineUser)
    })
    socket.on("sendMessage",(message)=>{
        const isOnline=onlineUser.filter((user)=>user.userId==message.recipientId);
        if(!isOnline.length) return;
        io.to(isOnline[0].socketId).emit("getMessage",message);
    })
    socket.on("disconnect", () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUser", onlineUser)
    })
})



io.listen(9090)