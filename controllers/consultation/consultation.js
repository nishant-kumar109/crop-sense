const { response } = require("../../app");
const Users = require('../../models').users
const Farmers = require('../../models').farmers
const Doctors = require('../../models').doctors
const Admins = require('../../models').admins

const responseHandler = require('../../utils/responseHandler')
const Consultaions = require('../../models').consultations
const ConsultationAttachments = require('../../models').consultation_attachments

const createConsultaion = async (req, res, next) => {
    console.log('hitting the api=== ')
    try {
        if(req.body.user.role == 'farmer'){
            const consultationObj = {
                farmer_id: req.body.user.id,
                doctor_id : req.query.doctor_id,
                crop_type : req.body['crop_type'],
                crop_name:  req.body['crop_name'],
                disease_name : req.body['disease_name'],
                disease_local_name : req.body['disease_local_name'],
                region:req.body.user.region,
                temprature_range : req.body.temprature_range,
                humidity_percentage : req.body.humidity_percentage,
                rain_fall : req.body.rain_fall,
                soil_type : req.body.soil_type,
                farmer_worries : req.body.farmer_worries,
                start_date : new Date(req.body['start_date']),
                end_date : new Date(req.body['end_date'])
            }
        const consultation = await Consultaions.createConsultation(consultationObj)

        let attachments = req.body.consultation_attachments
        const consultationAttachments = {}
        for(let i=0; i<attachments.length; i++){
            consultationAttachments['file_url'] = attachments[i]['file_url'],
            consultationAttachments['file_type'] = attachments[i]['file_type'],
            consultationAttachments['consultation_id'] = consultation.id
            await ConsultationAttachments.createConsultationAttachments(consultationAttachments)
        }
        
        const consultationAttachment = await ConsultationAttachments.findAll({
            where : {
                consultation_id : consultation.dataValues.id
            }
        })

        consultation.dataValues["consultationAttachments"] = consultationAttachment
        responseHandler.successDataResponse(res, consultation, "Consultaion created successfully")
    }
    } catch (error) {
        responseHandler.clientError(res, "consultation does not created")
        console.log(error);
    }

}

const updateConsultation = async (req,res,next) => {
    console.log('api is hittin')
    try {
        if(req.body.user.role == 'doctor'){
            const consultation_id = req.query.consultation_id;
            const consultationObj = req.body.edit_details;
            await Consultaions.updateConsultationById(consultationObj,{
                returning: true,
                where : {
                    id : consultation_id
                }
            })
            .then(([rowsUpdate, [updatedConsultation]])=> {
                console.log('rowsUpdated', rowsUpdate);
                responseHandler.successDataResponse(res, updatedConsultation,'consultation updated successfully')
              })
        }
    } catch (error) {
        console.log(error)
    }
}

const getAllConsultation = async (req, res, next)=>{
    console.log('api is hitting');
    try {
        const page = req.query.page
        const limit = req.query.pageSize || 10;
        const offset = (req.query.page - 1 || 0) * limit;
        if(req.body.user.role == 'farmer'){
            let user_id = req.body.user.id;
            let farmer = await Farmers.getFarmerByUserId(user_id)
            let farmer_id = farmer.dataValues.id
            console.log(farmer_id)
            let consultations = await Consultaions.getAllConsultationWithCount({
                where : {
                    farmer_id : farmer_id
                },
                order: [
                    ['id', 'DESC'],
                ],
            limit: limit,
            offset: offset
            })
            responseHandler.successPaginatedDataResponse(res, consultations, page, limit, 'all consultation retrieved successfully')
        }

        else if(req.body.user.role == 'doctor'){
            let user_id = req.body.user.id;
            let doctor = await Doctors.getDoctorByUserId(user_id)
            let doctor_id = doctor.dataValues.id
            console.log(doctor_id)
            let consultations = await Consultaions.getAllConsultationWithCount({
                where : {
                    doctor_id : doctor_id
                },
                order: [
                    ['id', 'DESC'],
                ],
            limit: limit,
            offset: offset
            })
            responseHandler.successPaginatedDataResponse(res, consultations, page, limit, 'all consultation retrieved successfully')
        }
    } catch (error) {
        console.log(error)
    }
}

const getConsultationById = async (req,res,next)=>{
    console.log('api is hitting',req.params.id);
    try {
        let consultation = await Consultaions.getConsultationById(req.params.id)
        if(consultation){
            responseHandler.successDataResponse(res, consultation,'consultation retrieved successfully')
        }else{
            responseHandler.successDataResponse(res, consultation,'no consultation found')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createConsultaion,
    updateConsultation,
    getConsultationById,
    getAllConsultation
}