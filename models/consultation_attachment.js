'use strict';

module.exports = (sequelize, DataTypes) =>{
    var ConsultationAttachments = sequelize.define("consultation_attachments", {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    consultation_id : {
        type : DataTypes.BIGINT
    },
    file_url : {
        type : DataTypes.TEXT
    },

    file_type : {
        type : DataTypes.ENUM('video', 'image')
    }

    })

    ConsultationAttachments.associate = function (models) {

    // one ConsultationAttachments belongs to one consultation
        ConsultationAttachments.belongsTo(models.consultations, {
            as : "consultation" , 
            foreignKey : "consultation_id",
            
        })
    }
    
    ConsultationAttachments.createConsultationAttachments = async (ConsultationAttachmentObj) => {
        return await ConsultationAttachments.create(ConsultationAttachmentObj);
    }
    
    return ConsultationAttachments;
}