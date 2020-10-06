'use strict';
module.exports = (sequelize, DataTypes) => {

    var Admins = sequelize.define("admins", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id : {
            type: DataTypes.BIGINT
        }
    },
        {
        freezeTableName: true, // Model tableName will be the same as the model name
        paranoid: true,
        timestamp: true,
        });

    Admins.associate = function (models) {
    
        Admins.belongsTo(models.users, {
            as : "user" , 
            foreignKey : "user_id",
            onDelete: 'cascade',
            hooks : true

        })
    }
        
    return Admins;
};