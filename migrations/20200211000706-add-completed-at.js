"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("tasks", "completedAt", Sequelize.DATE);
    },

    down: (queryInterface /*, Sequelize*/) => {
        return queryInterface.removeColumn("tasks", "completedAt");
    }
};
