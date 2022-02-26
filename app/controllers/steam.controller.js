const User = require("../models/user.model.js");
const UserRoot = require("../models/userroot.model.js");

// Authenticates a user via SteamOpenID
exports.authenticate = (req, res) => {
    res.redirect('/api/steam')
}

exports.returnRedirect = (req, res) => {
    res.redirect('http://localhost:3000/home');
}

exports.authenticationExecuted = (req, res) => {
    if(!req.user) {
        res.status(500).send({
            message: "Steam user is not authenticated or something went wrong during authentication."
        });

        return;
    }

    var steamUser = req.user;
    console.log("Steam user successfully authenticated: ", steamUser);

    UserRoot.findBySteamId(steamUser._json.steamid, (err, data) => {
        if (err) {
            if(err.kind === "not_found") {
                res.status(201).json({ redirectRoute: '/create-user', ...steamUser._json })
            } else {
                res.status(500).send({
                    message: "Error retrieveing user with steamid" + steamUser.steamid
                });
            }
        } else  {
            console.log(data);
            res.json(data);
        }
    });
}