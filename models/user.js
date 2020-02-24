"use strict";
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            name: {
                type: DataTypes.STRING,
                validate: { notEmpty: true }
            },
            email: {
                type: DataTypes.STRING,
                validate: { isEmail: true }
            },
            password: {
                type: DataTypes.STRING,
                validate: { notEmpty: true },
                get: function() {
                    return "sorry jack";
                },
                set: function(password) {
                    return this.setDataValue(
                        "password",
                        ("2q" + password)
                            .split("")
                            .reverse()
                            .join("")
                    );
                }
            }
        },
        {
            hooks: {
                afterCreate: (/*instance, options*/) => {
                    console.log("I sent an email!");
                }
            }
        }
    );

    User.associate = function(models) {
        User.hasMany(models.task);
    };

    User.prototype.isValidPassword = function(passwordAttempt) {
        return (
            ("2q" + passwordAttempt)
                .split("")
                .reverse()
                .join("") === this.getDataValue("password")
        );
    };

    return User;
};
