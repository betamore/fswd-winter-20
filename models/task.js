"use strict";
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define(
        "task",
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            completedAt: DataTypes.DATE
        },
        {
            scopes: {
                emptyDesc: {
                    where: {
                        description: { [Sequelize.Op.ne]: "" }
                    }
                },
                incomplete: {
                    where: {
                        completedAt: null
                    }
                },
                completedWithinAnHour: function() {
                    return {
                        where: {
                            completedAt: {
                                [Sequelize.Op.gt]: new Date() - 60 * 60 * 1000
                            }
                        }
                    };
                },
                completedWithinXHours: function(x) {
                    return {
                        where: {
                            completedAt: {
                                [Sequelize.Op.gt]:
                                    new Date() - 60 * 60 * 1000 * x
                            }
                        }
                    };
                }
            }
        }
    );
    Task.associate = function(models) {
        Task.belongsTo(models.user);
    };

    Task.prototype.isCompleted = function() {
        return !!this.completedAt;
    };

    Task.prototype.markCompleted = async function() {
        const timeNow = new Date();

        return this.update({
            completedAt: timeNow
        });
    };

    return Task;
};
