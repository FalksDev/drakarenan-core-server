const User = require("../models/user.model.js");
const UserRoot = require("../models/userroot.model.js");

// Create and save new user
exports.create = (req, res) => {
    // Validating request
    if (!req.body) {
        res.status(400).send({
            message: "User can not be empty!"
        });
    }

    // Create a new user
    const user = new User({
        userroot_id: req.body.userroot_id,
        phone_number: req.body.phone_number,
        email_address: req.body.email_address,
        avatar_url: req.body.avatar_url,
        rating: req.body.rating
    });

    // Save the user into the database
    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        }
        else {
            res.send(data);
        }
    });
};

exports.getSingle = (req, res) => {
    User.findById(req.params.id, (err, data) => {
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

exports.getSingleByRootId = (req, res) => {
    User.findByRootId(req.params.id, (err, data) => {
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

exports.getSingleFull = (req, res) => {
    UserRoot.findByUserName(req.params.username, (err, data) => {
        if (err) {
            if(err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with username ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieveing User with username" + req.params.id
                });
            }
        } else res.send(data);
    });
}

exports.getByStartingCharacters = (req, res) => {
    UserRoot.findByStartingCharacter(req.params.characters, (err, data) => {
        if (err) {
            if(err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with username ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieveing User with username" + req.params.id
                });
            }
        } else res.send(data);
    });
}