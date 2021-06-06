const express = require("express");
const session = require('express-session')
const config = require("./config");
const path = require("path");
const mysql = require("mysql2");
const port = process.env.APP_PORT || 8080;
const host = "0.0.0.0";
const FLAG = require("fs").readFileSync("flag.txt");

const connection = mysql.createConnection(config.db);
(function initDB() {
    sql = `create table if not exists users(
        id int not null auto_increment,
        username nvarchar(30) not null,
        password nvarchar(40) not null,
        money int,
        gifted tinyint(1),
        primary key (id)
    )`
    connection.query(sql);
    sql = `insert into users(username, password) values("HCMUS-admin", "HCMUS-${config.admin.password}")`
    connection.query(sql);
})();

const app = express();
app.use(express.json());
app.use(session(config.session));
app.use(express.static("public"))

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
    const allowedType = ["string", "number"];
    for (key in req.query) {
        if (!allowedType.includes(typeof (req.query[key])))
            return res.send("Nice try");
    }
    for (key in req.body) {
        if (!allowedType.includes(typeof (req.body[key])))
            return res.send("Nice try");
    }
    next();
})

app.get("/", (req, res) => {
    if (!req.session.authenticated)
        return res.redirect("/login");
    connection.query(
        "select money from users where username=?",
        [req.session.username],
        (err, result) => {
            money = 0;
            if (err)
                money = 0;
            else
                money = result[0].money;
            return res.render("index", { authenticated: req.session.authenticated, username: req.session.username, money: money });
        }
    )
});

app.get("/source", (req, res) => {
    return res.sendFile(path.join(__dirname, "server.js"));
})

app.route("/login")
    .all((req, res, next) => {
        if (req.session.authenticated)
            return res.redirect("/");
        next();
    })
    .get((req, res) => {
        res.render("login", { authenticated: false });
    })
    .post((req, res) => {
        username = req.body.username;
        if (typeof username == 'undefined')
            return res.json({ "status": 403, "message": "Username can't be blank" });
        password = req.body.password;
        if (typeof password == 'undefined')
            return res.json({ "status": 403, "message": "Password can't be blank" });
        connection.query(
            "select * from users where username = ? and password = ?",
            [username, password],
            (err, result) => {
                if (err)
                    return res.json({ "status": 403, "message": "Error occur" });
                if (result.length < 1)
                    return res.json({ "status": 403, "message": "Wrong username or password" });
                req.session.username = username;
                req.session.authenticated = true;
                return res.json({ "status": 200, "message": "Logged in" });
            }
        )
    })

app.route("/register")
    .get((req, res) => {
        res.render("register", { authenticated: false });
    })
    .post((req, res) => {
        username = req.body.username;
        if (typeof username == 'undefined')
            return res.json({ "status": 403, "message": "Username can't be blank" });
        password = req.body.password;
        if (typeof password == 'undefined')
            return res.json({ "status": 403, "message": "Password can't be blank" });
        connection.query(
            "select * from users where username = ?",
            [username],
            (err, result) => {
                if (err)
                    return res.json({ "status": 403, "message": "Error occurs" });
                if (result.length > 0)
                    return res.json({ "status": 403, "message": "Username already taken" });
                connection.query(
                    "insert into users(username, password, money, gifted) values(?, ?, 10, 0)",
                    [username, password],
                    (err) => {
                        if (err)
                            return res.json({ "status": 403, "message": "Error occurs" });
                        return res.json({ "status": 200, "message": "Create account successful" });
                    })
            })
    })

app.route("/flag")
    .post((req, res) => {
        if (!req.session.username)
            return res.json({ "status": 403, "message": "Not logged in" });
        connection.query(
            "select money from users where username=?",
            [req.session.username],
            (err, result) => {
                money = 0;
                if (err)
                    money = 0;
                else
                    money = result[0].money;
                if (money > 100)
                    return res.json({ "status": 200, "message": `Here is your flag: ${FLAG}` })
                return res.json({ "status": 403, "message": "But you dont have enough money" });
            })
    })

async function log(receiver) {
    // TODO: add real code instead of sleep
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(200);
}

app.route("/gift")
    .all((req, res, next) => {
        if (req.session.authenticated) {
            if (req.session.username == "HCMUS-admin")
                return next();
            return res.sendStatus(403);
        }
        return res.redirect("/login");
    })
    .get((req, res) => {
        return res.render("gift");
    })
    .post((req, res) => {
        receiver = req.body.receiver;
        if (typeof username == 'undefined')
            return res.json({ "status": 403, "message": "Username can't be blank" });
        connection.query(
            "select * from users where username=?",
            [receiver],
            (err, result) => {
                if (err)
                    return res.json({ "status": 403, "message": "Error occurs" });
                if (result.length < 1) {
                    return res.json({ "status": 403, "message": "Username not found" });
                }
                isGifted = result[0].gifted;
                if (isGifted)
                    return res.json({ "status": 200, "message": "Already gifted" });
                connection.query(
                    "update users set money = money + 10 where username=?",
                    [receiver],
                    (err) => {
                        if (err)
                            return res.json({ "status": 403, "message": "Error occurs" });
                        log(receiver).then(() => {
                            connection.query(
                                "update users set gifted = 1 where username=?",
                                [receiver],
                                (err) => {
                                    if (err)
                                        return res.json({ "status": 403, "message": "Error occurs" });
                                    return res.json({ "status": 200, "message": "Success" });
                                })
                        });
                    })
            })
    })

app.route("/logout")
    .get((req, res) => {
        delete req.session.authenticated;
        delete req.session.username;
        res.redirect("/login");
    })

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);
