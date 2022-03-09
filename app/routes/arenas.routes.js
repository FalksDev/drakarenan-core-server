module.exports = (app) => {
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

    // Gets all Arenas in the redis cache database
    router.get("/", (req, res) => {
        client.hGetAll("Arenas")
            .then(object => {
                const arenas = JSON.parse(JSON.stringify(object));
                console.log(arenas);
                res.status(200).json(arenas)
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });

    router.get("/arena/:arenaId", (req, res) => {
        const arenaId = req.params.arenaId;
        client.hGet("Arenas", arenaId)
            .then(value => {
                const arena = JSON.parse(value);
                console.log("Found Arena with id: " + arena.id);
                res.status(200).json(arena);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    });

    router.post("/arena/removequeuedplayer/:arenaId", (req, res) => {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            })
        }

        const userRootId = req.body.userroot_id;
        const arenaId = req.params.arenaId;
        client.hGet("Arenas", arenaId)
            .then(value => {
                const arena = JSON.parse(value);
                const newQueuedPlayers = arena.queued_players.filter((item) => item.userroot_id !== userRootId)
                arena.queued_players = newQueuedPlayers;

                client.hSet("Arenas", arena.id, JSON.stringify(arena))
                    .then(number => {
                        console.log("Successfully removed queued player useroot_id: " + userRootId)
                        res.send();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    })

    router.post("/arena/removeplayercompletely/:arenaId", (req, res) => {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            })
        }

        const userRootId = req.body.userroot_id;
        const arenaId = req.params.arenaId;
        client.hGet("Arenas", arenaId)
            .then(value => {
                const arena = JSON.parse(value);
                const newQueuedPlayers = arena.queued_players.filter((item) => item.userroot_id !== userRootId)
                const newPlayers = arena.players.filter((item) => item.userroot_id !== userRootId)
                arena.queued_players = newQueuedPlayers;
                arena.players = newPlayers;

                client.hSet("Arenas", arena.id, JSON.stringify(arena))
                    .then(number => {
                        console.log("Successfully removed queued player useroot_id: " + userRootId)
                        res.send();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    })

    router.post("/arena/addqueuedplayer/:arenaId", (req, res) => {
        if (!req.body) {
            res.status(400).send({
                message: "QueuedPlayer can not be empty!"
            });
        }

        const queuedPlayer = req.body;

        const arenaId = req.params.arenaId;
        client.hGet("Arenas", arenaId)
            .then(value => {
                const arena = JSON.parse(value);
                arena.queued_players.push(queuedPlayer);

                client.hSet("Arenas", arena.id, JSON.stringify(arena))
                    .then(number => {
                        console.log(`Successfully added queued player ${queuedPlayer} on arena: ${arenaId}`);
                        res.send();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    })

    router.post("/arena/addplayer/:arenaId", (req, res) => {

        console.log("APA");

        if (!req.body) {
            res.status(400).send({
                message: "QueuedPlayer can not be empty!"
            });
        }

        const player = req.body;

        const arenaId = req.params.arenaId;
        client.hGet("Arenas", arenaId)
            .then(value => {
                const arena = JSON.parse(value);
                arena.players.push(player);

                client.hSet("Arenas", arena.id, JSON.stringify(arena))
                    .then(number => {
                        console.log(`Successfully added player ${player} on arena: ${arenaId}`);
                        res.send();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    })

    router.post("/arena/removeplayer/:arenaId", (req, res) => {
        if(!req.body) {
            res.status(400).send({
                message: "Body can not be empty!"
            })
        }

        const userRootId = req.body.userroot_id;
        const arenaId = req.params.arenaId;
        client.hGet("Arenas", arenaId)
            .then(value => {
                const arena = JSON.parse(value);
                const newPlayers = arena.players.filter((item) => item.userroot_id !== userRootId)
                arena.players = newPlayers;

                client.hSet("Arenas", arena.id, JSON.stringify(arena))
                    .then(number => {
                        console.log("Successfully removed queued player useroot_id: " + userRootId)
                        res.send();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    })

    // Deletes a specific ARENA
    router.delete("/arena/:arenaId", (req,res) => {
        const arenaId = req.params.arenaId;
        client.hDel("Arenas", arenaId).then(number => {
            console.log(`Arena '${arenaId}' was successfully deleted: ${number}`);
            res.status(200).send(`Arena '${arenaId}' was successfully deleted: ${number}`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
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