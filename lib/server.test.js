"use strict";

// code to test
var serverLib = require("./server");
var server = serverLib.app;
var models = require("../models");

// libraries
var request = require("supertest").agent,
    agent;

beforeEach(function() {
    return models.sequelize.sync({ force: true });
});

it("should have a test", function() {
    expect(true).toBe(true);
});

// This is a unit test example
describe("excludeLoggedIn", function() {
    it("should continue if there is no user", function() {
        const fakeRequest = {};
        const fakeResponse = {
            redirect: jest.fn()
        };
        const fakeNext = jest.fn();
        serverLib.excludeLoggedIn(fakeRequest, fakeResponse, fakeNext);
        expect(fakeResponse.redirect).not.toHaveBeenCalled();
        expect(fakeNext).toHaveBeenCalled();
    });
    it("should redirect if there is a user", function() {
        const fakeRequest = { user: {} };
        const fakeResponse = {
            redirect: jest.fn()
        };
        const fakeNext = jest.fn();
        serverLib.excludeLoggedIn(fakeRequest, fakeResponse, fakeNext);
        expect(fakeResponse.redirect).toHaveBeenCalledWith("/tasks");
        expect(fakeNext).not.toHaveBeenCalled();
    });
});

describe("server", function() {
    beforeEach(function() {
        agent = request(server);
    });

    // it('should respond with "Hello world!" on /', function() {
    //     return agent.get("/").expect(200, /Hello world!/);
    // });

    // ["David", "John", "Lee"].forEach(function(name) {
    //     it('should respond with "Hello ' + name + '!" on /' + name, function() {
    //         return agent
    //             .get("/" + name)
    //             .expect(200)
    //             .then(response => {
    //                 expect(response.text).toMatch(`Hello ${name}`);
    //             });
    //     });
    // });

    describe("register", function() {
        it.skip("should login when registering", function() {
            return agent
                .post("/register")
                .type("form")
                .send({
                    name: "myNewUsername",
                    email: "test@example.com",
                    password: "myFancyPassword",
                    passwordConfirm: "myFancyPassword"
                })
                .expect(302)
                .expect("Location", "/tasks")
                .then(function() {
                    return agent
                        .get("/tasks")
                        .expect(200, /Tasks for myNewUsername/);
                });
        });

        it("should return the new user", function() {
            return agent
                .post("/register")
                .set("Accept", "application/json")
                .send({
                    name: "myNewUsername",
                    email: "test@example.com",
                    password: "myFancyPassword",
                    passwordConfirm: "myFancyPassword"
                })
                .expect(200)
                .then(response => {
                    expect(response.body.email).toEqual("test@example.com");
                });
        });

        describe("when there is an existing user", function() {
            let user;
            beforeEach(async function() {
                user = await models.user.create({
                    name: "existingUser",
                    email: "test@example.com",
                    password: "1234"
                });
            });
            afterEach(async function() {
                await user.destroy();
            });

            it("should return 400 for an existing email", async function() {
                await agent
                    .post("/register")
                    .set("Accept", "application/json")
                    .send({
                        name: "myNewUsername",
                        email: "test@example.com",
                        password: "myFancyPassword",
                        passwordConfirm: "myFancyPassword"
                    })
                    .expect(400);
            });
        });
    });
});
