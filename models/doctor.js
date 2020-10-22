'use strict';
module.exports = (sequelize, DataTypes) => {

    var Doctors = sequelize.define("doctors", {

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
        expert_in : {
            type: DataTypes.STRING
        },
        certified_from : {
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

    Doctors.associate = function (models) {
    
        Doctors.belongsTo(models.users, {
            as : "user" , 
            foreignKey : "user_id",
            onDelete: 'cascade',
            hooks : true

        })

        Doctors.hasMany(models.consultations, {
            as : "consultation" , 
            foreignKey : "doctor_id",
            onDelete: 'cascade',
            hooks : true

        })
    }

    Doctors.createDoctor = async(docObj)=>{
        return await Doctors.create(docObj)
    }

    Doctors.editDoctor = async (editObject, includeObj) => {
        return await Doctors.update(editObject, includeObj);
    }

    Doctors.getDoctorByUserId = async(userId)=>{
        return await Doctors.findOne({
            where : {
                user_id : userId
            }
        })
    }
        
    return Doctors;
};