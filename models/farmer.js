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

        Farmers.hasMany(models.consultations, {
            as : "consultation" , 
            foreignKey : "farmer_id",
            onDelete: 'cascade',
            hooks : true

        })
        
    }
    
    Farmers.createFarmer = (farmerObj)=>{
        return Farmers.create(farmerObj)
    }

    Farmers.editFarmer = async (editObject, includeObj) => {
        return await Farmers.update(editObject, includeObj);
    }
    
    Farmers.getFarmerByUserId = async(userId)=>{
        return await Farmers.findOne({
            where : {
                user_id : userId
            }
        })
    }

    // Farmers.getFarmerById = (includeObj)=>{
    //     return Farmers.findOne(includeObj)
    // }

    return Farmers;
};