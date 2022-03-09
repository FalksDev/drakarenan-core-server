module.exports = (io) => {

    const nsp = io.of("/arenas");
        // Run when a client connects
    nsp.on('connection', (socket) => {
        console.log("Socket joined Arenas: " + socket.id)

        socket.on("disconnect", () => {
            console.log("Socket: " + socket.id + " disconnected..")
        })

        socket.on("createArena", arenaId => {
            socket.join(arenaId);
            socket.broadcast.emit("arenaCreated", arenaId);
        })

        socket.on("joinArena", arenaId => {
            socket.join(arenaId);
            nsp.in(arenaId).emit("joinedArena", arenaId);
        })

        socket.on("leaveArena", arenaId => {
            socket.leave(arenaId);
            nsp.in(arenaId).emit("leftArena", arenaId);
        })

        socket.on("cancelArena", arenaId => {
            console.log(arenaId);
            socket.broadcast.to(arenaId).emit("cancelledArena", arenaId);
            socket.broadcast.emit("arenaDeleted", arenaId);
        })

        socket.on("activatePlayer", arenaId => {
            nsp.in(arenaId).emit("activatedPlayer", arenaId);
            nsp.emit("changed", arenaId);
        })
        
        socket.on("deactivatePlayer", arenaId => {
            nsp.in(arenaId).emit("deactivatedPlayer", arenaId);
            nsp.emit("changed", arenaId);
        })
    });

    nsp.on('disconnect' , (socket) => {
        console.log("Socket disconnected Arenas: " + socket.id)
    })
}

