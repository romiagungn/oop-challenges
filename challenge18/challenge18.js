const readline = require('readline');
const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/university.db";

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    // console.log("Koneksi ke database berhasil!");
});
module.exports = db;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(`
=========================================================
Welcome to Universitas Pendidikan Indonesia
JL. Setiabudi No.255
=========================================================
`);
    rl.question(`username :`, (username) => {
        console.log(`=========================================================`);
        rl.question(`password :`, (password) => {
            console.log(`=========================================================`);

            db.serialize(function () {

                let sql = `SELECT * FROM users WHERE username == '${username}' AND password == '${password}'`;
                db.get(sql, (err, rows) => {
                    if (err) throw err;
                    if (rows) {
                        console.log(`Welcome, ${rows.username}. YOUR access level is: ${rows.user}`);
                        mainmenu();
                    }
                    else {
                        console.log("USERNAME atau PASSWORD salah men!!!");
                    }
                })
            })
        })
    })
