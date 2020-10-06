'use strict';
module.exports = (sequelize, DataTypes) => {

    var Farmers = sequelize.define("farmers", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id : {
            type: DataTypes.BIGINT
        },
        region_belongs_to: {
            type: DataTypes.STRING
        },
        total_exprience : {
            type: DataTypes.BIGINT
        },
        about_me :{
            type: DataTypes.STRING
        }
    },
        {
        freezeTableName: true, // Model tableName will be the same as the model name
        paranoid: true,
        timestamp: true,
        });

    Farmers.associate = function (models) {
    
        Farmers.belongsTo(models.users, {
            as : "user" , 
            foreignKey : "user_id",
            onDelete: 'cascade',
            hooks : true

        })
    }
        
    return Farmers;
};