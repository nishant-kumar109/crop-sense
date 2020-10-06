'use strict';
module.exports = (sequelize, DataTypes) => {

    var Users = sequelize.define("users", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        mobile_number: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING
        },
        img_url: {
            type: DataTypes.STRING
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
        } 
    },
        {
        freezeTableName: true, // Model tableName will be the same as the model name
        paranoid: true,
        timestamp: true,
        });
        
    return Users;
};