"use strict";


const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    var Build = sequelize.define('Build', {
        project: {
            type: DataTypes.STRING
        },
        desc : {
            type: DataTypes.STRING
        },
        status : {
            type: DataTypes.STRING
        },
        platforms : {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        force: false
    });
};


