"use strict";

module.exports = function(sequelize, DataTypes) {
    var Build = sequelize.define('Build', {
        project: {
            type: DataTypes.STRING
        },
        desc : {
            type: DataTypes.STRING
        },
        status : {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        force: false
    });

  return Build;
};


