module.exports = app => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Creates a new user
    router.post("/", user.create);

    // Gets a single user
    router.get("/:id", user.getSingle);

    router.get("/byusername/:username", user.getSingleFull);

    router.get("/byroot/:id", user.getSingleByRootId);

    router.get("/byuuid/:uuid", user.getSingleByUUID);

    router.get("/bystartingcharacters/:characters", user.getByStartingCharacters);
    
    app.use('/api/user', router);
};