const sql = require("./db.js");

const User = function(user) {
    this.userroot_id = user.userroot_id;
    this.phone_number = user.phone_number;
    this.email_address = user.email_address;
    this.avatar_url = user.avatar_url;
    this.rating = user.rating
}

User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { id: res.insertId, ...User });
        result(null, { id: res.insertId, ...User });
    });
}

User.findById = (id, result) => {
    sql.query(`SELECT * FROM user WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found any user with that specific ID
        result({ kind: "not_found" }, null);
    });
}

User.findByRootId = (id, result) => {
    sql.query(`SELECT * FROM user WHERE userroot_id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found any user with that specific ID
        result({ kind: "not_found" }, null);
    });
}

module.exports = User;