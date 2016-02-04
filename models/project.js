"use strict";

module.exports = function(sequelize, DataTypes) {
    var Project = sequelize.define('Project', {
        name: {
            type: DataTypes.STRING
        },
        version: {
            type: DataTypes.INTEGER
        }
    }, {
        freezeTableName: true,
        force: false
    });

  return Project;
};


