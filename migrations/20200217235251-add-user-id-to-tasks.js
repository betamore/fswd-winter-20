"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("tasks", "userId", Sequelize.INTEGER);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("tasks", "userId");
    }
};
