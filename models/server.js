"use strict";

module.exports = function(sequelize, DataTypes) {
    var Server = sequelize.define('Server', {
        hostname: {
            type: DataTypes.STRING
        },
        localip: {
            type: DataTypes.STRING
        },
        project: {
            type: DataTypes.STRING
        },
        platform: {
            type: DataTypes.STRING
        },
        build: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        force: true
    });

  return Server;
};


