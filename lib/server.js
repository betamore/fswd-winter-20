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
    await models.task.create({ name: request.body.name });

    response.format({
        html: function() {
            response.redirect("/tasks");
        },
        json: async function() {
            response.json(await models.task.findAll());
        }
    });
});

app.get("/tasks/:id", async (request, response) => {
    const task = await models.task.findByPk(request.params.id);
    response.format({
        html: function() {
            if (task) {
                response.send(JSON.stringify(task));
            } else {
                response.sendStatus(404);
            }
        },
        json: function() {
            response.json(task);
        }
    });
});

app.post("/tasks/:id/complete", async (request, response) => {
    const task = await models.Task.findByPk(request.params.id);

    await task.markCompleted();

    if (task) {
        response.redirect("/tasks");
    } else {
        response.sendStatus(404);
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
            response.redirect("/tasks");
        });
    } else {
        response.render("/login", {
            error: "Password does not match",
            email: request.body.email
        });
    }
});

app.get("/register", (request, response) => {
    if (request.user) {
        response.redirect("/tasks");
    } else {
        response.render("register");
    }
});

app.post("/register", async (request, response) => {
    const { email, password, passwordConfirm, name } = request.body;
    const extantUser = await models.user.findOne({ where: { email } });

    if (extantUser) {
        response.render("register", {
            name,
            email,
            message: "User with email already exists"
        });
    } else if (password !== passwordConfirm) {
        response.render("register", {
            name,
            email,
            message: "Passwords must match"
        });
    } else {
        models.user
            .create({ name, email, password })
            .then(function() {
                response.redirect("/tasks");
            })
            .catch(function(error) {
                response.render("register", {
                    name,
                    email,
                    message: `Something went wrong: ${error}`
                });
            });
    }
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
module.exports = app;
