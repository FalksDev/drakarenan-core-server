module.exports = (app, io) => {
    var router = require("express").Router();
    
    const { client } = require("../models/redis.js");

    // Creates a new ARENA in the redis-db
    router.post("/", async (req, res) => {
        if (!req.body) {
            res.status(400).send({
                message: "User can not be empty!"
            });
        }

        const arenaId = await client.incr("arenaIds");
        const arena = {
            id: arenaId,
            ...req.body
        };

        client.get("arenaIds").then(value => {
            console.log(value)
        })

        client.hSet("Arenas", arena.id, JSON.stringify(arena)).then(number => {
            client.hGet("Arenas", arena.id).then(value => {
                console.log(value)
                res.json(JSON.parse(value));
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err.toString());
            })
        })
        .catch(err => {
            res.status(500).send(err);
        });
    });

    // Run when a client connects
    io.on('connection', (socket) => {
        //Welcomes the current user
        socket.emit("message", "Welcome to drakarenan");
        
        // socket.broadcast.emit() - Detta emittar ett event till alla anslutna klienter FÖRUTOM den som i detta fallet "connectar".
        socket.broadcast.emit("message", "A user has joined the Arenas!");
    
        socket.on("disconnect", () => {
            io.emit("message", "A user has left the arenas.");
        });
    });

    app.use('/api/arenas', router);
};



// a();

// async function a() {
//     await redisClient.connect();
//     await redisClient.set("framework", "ReactJS");
//     console.log(await redisClient.get("framework"))
//     console.log(process.env.REDIS_PORT);
// }