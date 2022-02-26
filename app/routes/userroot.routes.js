module.exports = app => {
    const userroot = require("../controllers/userroot.controller.js");

    var router = require("express").Router();

    // Creates a new userroot
    router.post("/", userroot.create);

    // Gets a single userroot
    router.get("/:id", userroot.getSingle);

    // Gets all userroots
    router.get("/", userroot.getAll);

    app.use('/api/userroot', router);
};