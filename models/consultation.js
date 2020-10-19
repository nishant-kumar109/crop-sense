'use strict';
module.exports = (sequelize, DataTypes) => {

    var Consultations = sequelize.define("consultations", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        farmer_id : {
            type: DataTypes.BIGINT
        },
        doctor_id : {
            type: DataTypes.BIGINT
        },
        crop_type : {
            type : DataTypes.STRING
        },
        crop_name : {
            type : DataTypes.STRING
        },
        disease_name : {
            type : DataTypes.STRING
        },
        disease_local_name : {
            type : DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
        },
        temprature_range : {
            type: DataTypes.STRING
        },
        humidity_percentage : {
            type: DataTypes.BIGINT
        },
        rain_fall :{
            type: DataTypes.STRING
        },
        soil_type : {
            type : DataTypes.STRING
        },
        farmer_worries : {
            type : DataTypes.STRING
        },
        doctor_solutions : {
            type : DataTypes.STRING
        },
        start_date : {
            type : DataTypes.DATE
        },
        end_date : {
            type : DataTypes.DATE
        },
        consultation_date : {
            type : DataTypes.DATE,
        },
        doctor_accepted : {
            type : DataTypes.BOOLEAN,
            default : false
        }
    },
    {
    freezeTableName: true, // Model tableName will be the same as the model name
    paranoid: true,
    timestamp: true,
    });

    Consultations.associate = function (models) {

    
        Consultations.belongsTo(models.doctors, {
            as : "doctor" , 
            foreignKey : "doctor_id",
            onDelete: 'cascade',
            hooks : true

        })

        Consultations.belongsTo(models.farmers, {
            as : "farmer" , 
            foreignKey : "farmer_id",
            onDelete: 'cascade',
            hooks : true

        })

        Consultations.hasMany(models.consultation_attachments, {
            as : "consultation_attachments" , 
            foreignKey : "consultation_id",
            
        })
        // one consultation has many consultationAttachment
        

    }

    Consultations.createConsultation = async(consultationObj) => {
        return await Consultations.create(consultationObj);
    }
    
    Consultations.updateConsultationById = async (editObj, includeObj) =>{
        return await Consultations.update(editObj, includeObj)
    }

    Consultations.getAllConsultationWithCount = async () => {
        return await Consultations.findAndCountAll()
    }

    Consultations.getConsultationById = async (consultation_id) => {
        return await Consultations.findOne({
            where : {
                id : consultation_id
            }
        })
    }
        
    return Consultations;
};