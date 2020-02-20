"use strict";

// code to test
var server = require("./server");
var models = require("../models");

// libraries
var request = require("supertest").agent,
    agent;

beforeAll(function() {
    return models.sequelize.sync({ force: true });
});

it("should have a test", function() {
    expect(true).toBe(true);
});

describe("server", function() {
    beforeEach(function() {
        agent = request(server);
    });

    it('should respond with "Hello world!" on /', function() {
        return agent.get("/").expect(200, /Hello world!/);
    });

    ["David", "John", "Lee"].forEach(function(name) {
        const helloName = new RegExp(`Hello ${name}!`);

        it(
            'should respond with "Hello, ' + name + '!" on /' + name,
            function() {
                return agent
                    .get("/" + name)
                    .expect(200)
                    .then(response => {
                        expect(response.text.search(helloName)).toBeGreaterThan(
                            -1
                        );
                    });
            }
        );
    });

    describe("register", function() {
        it("should login when registering", function() {
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
    });
});
