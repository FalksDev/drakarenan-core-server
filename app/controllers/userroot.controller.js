const UserRoot = require("../models/userroot.model.js");

// Create and save new userroot
exports.create = (req, res) => {
    // Validating request
    if (!req.body) {
        res.status(400).send({
            message: "UserRoot can not be empty!"
        });
    }

    // Create a new UserRoot
    const userroot = new UserRoot({
        steam_64_id: req.body.steam_64_id,
        username: req.body.username
    });

    // Save the UserRoot into the database 
    UserRoot.create(userroot, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the UserRoot."
            });
        }
        else {
            res.send(data);
        }
    });
};

exports.getSingle = (req, res) => {
    UserRoot.findById(req.params.id, (err, data) => {
        if (err) {
            if(err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found UserRoot with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieveing UserRoot with id" + req.params.id
                });
            }
        } else res.send(data);
    });
}

exports.getAll = (req, res) => {
    UserRoot.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving all userroots."
            });
        } else res.send(data);
    });
}