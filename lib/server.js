"use strict";

var express = require("express"),
    morgan = require("morgan"),
    models = require("../models"),
    session = require("express-session");

var bodyParser = require("body-parser");

// Create the express application object
var app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var SequelizeStore = require("connect-session-sequelize")(session.Store);
var sessionStore = new SequelizeStore({
    db: models.sequelize
});
sessionStore.sync();
app.use(
    session({
        secret: "Shhhhh!",
        store: sessionStore,
        saveUninitialized: true,
        resave: false
    })
);

if (process.env.NODE_ENV === "development") {
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpack = require("webpack");
    const webpackConfig = require("../webpack.config");

    const compiler = webpack(webpackConfig);
    app.use(
        webpackMiddleware(compiler, {
            publicPath: "/", // Same as `output.publicPath` in most cases.
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        })
    );
}

/**
 * pre-load User model if user_id on session
 */

// app.use((request, response, next) => {
//     if (request.body) {
//         console.log(request.body);
//     }
//     next();
// });
app.use(async function(request, response, next) {
    if (request.session.user_id) {
        request.user = await models.user.findByPk(request.session.user_id);
    }
    next();
});

app.use(function(request, response, next) {
    if (request.user) {
        response.locals.username = request.user.name;
    }
    next();
});

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
    // Setup the loggin format, depending on running environment
    app.use(
        morgan(process.env.NODE_ENV === "development" ? "dev" : "combined")
    );
}

// Add the static middleware, pointed at the ./public directory
app.use(express.static("public"));

app.get("/", (request, response) =>
    response.render("index", { name: "world" })
);

app.get("/tasks", async (request, response) => {
    response.format({
        html: function() {
            if (!request.user) {
                response.redirect("/login");
            } else {
                const tasks = request.user.getTasks();
                // response.send(tasks.map(task => task.name).join(", "));
                response.render("tasks", { tasks });
            }
        },
        json: async function() {
            const tasks = await models.task.findAll();
            response.json(tasks);
        }
    });
});

app.post("/tasks", async (request, response) => {
    const task = await models.task.create({ name: request.body.name });

    response.format({
        html: function() {
            response.redirect("/tasks");
        },
        json: async function() {
            response.json(task);
        }
    });
});

app.param("task_id", async (request, response, next, id) => {
    const task = await models.task.findByPk(id);
    if (task) {
        request.task = task;
        next();
    } else {
        response.sendStatus(404);
    }
});

app.get("/tasks/:task_id", async (request, response) => {
    response.format({
        html: function() {
            response.send(JSON.stringify(request.task));
        },
        json: function() {
            response.json(request.task);
        }
    });
});

app.post("/tasks/:task_id/complete", async (request, response) => {
    if (request.task.isCompleted()) {
        response.sendStatus(451);
    } else {
        await request.task.markCompleted();

        response.format({
            html: function() {
                response.redirect("/tasks");
            },
            json: function() {
                response.json(request.task);
            }
        });
    }
});

app.get("/login", (request, response) => {
    if (request.user) {
        response.redirect("/tasks");
    } else {
        response.render("login");
    }
});

app.post("/login", async (request, response) => {
    const user = await models.user.findOne({
        where: { email: request.body.email }
    });

    if (!user) {
        response.render("/login", {
            error: "User not found"
        });
    } else if (user.isValidPassword(request.body.password)) {
        request.session.user_id = user.id;
        request.session.save(function() {
            response.format({
                html: function() {
                    response.redirect("/tasks");
                },
                json: function() {
                    response.json(user);
                }
            });
        });
    } else {
        response.render("/login", {
            error: "Password does not match",
            email: request.body.email
        });
    }
});

app.post("/logout", async (request, response) => {
    request.session.destroy();
    response.format({
        json: function() {
            response.json(true);
        }
    });
});

const excludeLoggedIn = (request, response, next) => {
    if (request.user) {
        response.redirect("/tasks");
    } else {
        next();
    }
};

app.get("/register", excludeLoggedIn, (request, response) => {
    response.render("register");
});

app.post("/register", excludeLoggedIn, async (request, response) => {
    const { email, password, passwordConfirm, name } = request.body;
    const extantUser = await models.user.findOne({ where: { email } });

    if (extantUser) {
        response.format({
            html: function() {
                response.render("register", {
                    name,
                    email,
                    message: "User with email already exists"
                });
            },
            json: function() {
                response
                    .status(400)
                    .json({ error: "User with email already exists" });
            }
        });
    } else if (password !== passwordConfirm) {
        response.format({
            html: function() {
                response.render("register", {
                    name,
                    email,
                    message: "Passwords must match"
                });
            }
        });
    } else {
        try {
            const user = await models.user.create({ name, email, password });
            request.session.user_id = user.id;
            request.session.save(function() {
                response.format({
                    html: function() {
                        response.redirect("/tasks");
                    },
                    json: function() {
                        response.json(user);
                    }
                });
            });
        } catch (error) {
            response.format({
                html: function() {
                    response.render("register", {
                        name,
                        email,
                        message: `Something went wrong: ${error}`
                    });
                }
            });
        }
    }
});

app.post("/register/email-check", async (request, response) => {
    const email = request.body.email;
    setTimeout(async () => {
        const user = await models.user.findOne({ where: { email } });
        response.json(!!user);
    }, (email.length % 2) * 1000);
});

app.get("/check-login", async (request, response) => {
    response.json(request.user);
});

app.get("/:name", (request, response) =>
    response.render("index", {
        name: request.params.name,
        inseam: request.query.inseam
    })
);

app.post("/:name", (request, response) => {
    response.render("index", {
        name: request.params.name,
        inseam: request.body.inseam
    });
});

// allow other modules to use the server
module.exports = { app, excludeLoggedIn };
