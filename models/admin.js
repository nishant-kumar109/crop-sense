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

    Admins.createAdmin = (adminObj)=>{
        return Admins.create(adminObj)
    }

    Admins.getAdminByUserId = async(userId)=>{
        return await Admins.findOne({
            where : {
                user_id : userId
            }
        })
    }
        
    return Admins;
};