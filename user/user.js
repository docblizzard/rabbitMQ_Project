const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');


async function createUser(username, password) {
    try {
        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });

        const db = new sqlite3.Database('mydatabase.db');
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM user WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (row) {
            console.log("Username already taken");
            return { created: false, error: "Username already taken" };
        } else {
            const id = Date.now();
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO user (id, username, password) VALUES (?, ?, ?)', [id, username, hash], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`A new user has been added with ID ${id}`);
                        resolve();
                    }
                });
            });
            db.close();
            return { created: true };
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return { created: false, error: "Internal server error" };
    }
}

async function authUser(username, password) {
    try {
        const db = new sqlite3.Database('mydatabase.db');
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM user WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        db.close();

        if (!row) {
            console.log("User not found");
            return { isAuthenticated: false };
        }

        const isPasswordMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(password, row.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (isPasswordMatch) {
            console.log("Password matches");
            return { isAuthenticated: true };
        } else {
            console.log("Password does not match");
            return { isAuthenticated: false };
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
}

module.exports = { createUser, authUser };