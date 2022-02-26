const sql = require("./db.js");

// Constructor
const UserRoot = function(userroot) {
    this.steam_64_id = userroot.steam_64_id;
    this.username = userroot.username;
}

UserRoot.create = (newUserRoot, result) => {
    sql.query("INSERT INTO userroot SET?", newUserRoot, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created userroot: ", { id: res.insertId, ...UserRoot });
        result(null, { id: res.insertId, ...UserRoot });
    });
}

UserRoot.findById = (id, result) => {
    sql.query(`SELECT * FROM userroot WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found userroot: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found any user with that specific ID
        result({ kind: "not_found" }, null);
    });
}

UserRoot.findBySteamId = (id, result) => {
    sql.query(`SELECT * FROM userroot WHERE steam_64_id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found userroot: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found any user with that specific ID
        result({ kind: "not_found" }, null);
    });
}

UserRoot.findByUserName = (username, result) => {
    sql.query(`SELECT * FROM userroot JOIN user ON userroot.id = user.userroot_id WHERE userroot.username = '${username}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found userroot: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found any user with that specific ID
        result({ kind: "not_found" }, null);
    });
}


UserRoot.getAll = (result) => {
    sql.query("SELECT * FROM userroot JOIN user ON userroot.id = user.userroot_id ORDER BY user.rating DESC", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("userroots: ", res);
        result(null, res);
    })
}

UserRoot.findByStartingCharacter = (characters, result) => {
    sql.query(`SELECT userroot.*, user.avatar_url FROM userroot JOIN user ON userroot.id = user.userroot_id WHERE username LIKE CONCAT('${characters}', '%')`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found userroot: ", res);
            result(null, res);
            return;
        }

        // Not found any user with that specific ID
        result({ kind: "not_found" }, null);
    });
}

module.exports = UserRoot;