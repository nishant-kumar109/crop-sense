const Farmers = require('../../models').farmers
const Doctors = require('../../models').doctors

const responseHandler = require('../../utils/responseHandler')
const Consultations = require('../../models').consultations
const ConsultationAttachments = require('../../models').consultation_attachments

const createConsultaion = async (req, res, next) => {
    try {
        if (req.user.role == 'farmer') {
            const consultationObj = {
                farmer_id: req.user.farmer_id,
                doctor_id: req.query.doctor_id,
                crop_type: req.body['crop_type'],
                crop_name: req.body['crop_name'],
                disease_name: req.body['disease_name'],
                disease_local_name: req.body['disease_local_name'],
                region: req.body.region,
                temprature_range: req.body.temprature_range,
                humidity_percentage: req.body.humidity_percentage,
                rain_fall: req.body.rain_fall,
                soil_type: req.body.soil_type,
                farmer_worries: req.body.farmer_worries,
                start_date: new Date(req.body['start_date']),
                end_date: new Date(req.body['end_date'])
            }
            const consultation = await Consultations.createConsultation(consultationObj)

            let attachments = req.body.consultation_attachments
            for (let i = 0; i < attachments.length; i++) {
                attachments[i]['consultation_id'] = consultation.id
            }
            await ConsultationAttachments.bulkCreate(attachments)

            responseHandler.successDataResponse(res, consultation, "Consultaion created successfully")
        } else {
            responseHandler.unAuthorised(res)
        }
    } catch (error) {
        console.log(error);
        responseHandler.clientError(res, "consultation does not created")
        
    }

}

const updateConsultation = async (req, res, next) => {
    try {
        if (req.user.role == 'doctor') {
            const consultation_id = req.query.consultation_id;
            const consultationObj = req.body.edit_details;
            let consultation = await Consultations.updateConsultationById(consultationObj, {
                returning: true,
                where: {
                    id: consultation_id
                }
            })
                .then(([rowsUpdate, [updatedConsultation]]) => {
                    console.log('rowsUpdated', rowsUpdate);
                    return updatedConsultation
                })
            responseHandler.successDataResponse(res, consultation, "Consultaion updated successfully")
        } else {
            responseHandler.unAuthorised(res)
        }
    } catch (error) {
        console.log(error)
    }
}

const getAllConsultation = async (req, res, next) => {
    try {
        const page = req.query.page
        const limit = req.query.pageSize || 10;
        const offset = (req.query.page - 1 || 0) * limit;
        if (req.user.role == 'farmer') {
            let user_id = req.user.id;
            let farmer = await Farmers.getFarmerByUserId(user_id)
            let farmer_id = farmer.dataValues.id
            console.log(farmer_id)
            let consultations = await Consultations.getAllConsultationByFarmerId({
                include: [{
                    model: ConsultationAttachments,
                    as: "consultation_attachments",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }],
                distinct: true,
                order: [
                    ['id', 'DESC'],
                ],
                limit: limit,
                offset: offset
            })
            responseHandler.successPaginatedDataResponse(res, consultations, page, limit, 'all consultation retrieved successfully')
        }

        else if (req.user.role == 'doctor') {
            let user_id = req.user.id;
            let doctor = await Doctors.getDoctorByUserId(user_id)
            console.log(doctor)
            let doctor_id = doctor.dataValues.id
            console.log(doctor_id)

            let consultations = await Consultations.getAllConsultationByDoctorId({
                where: {
                    doctor_id: doctor_id
                },
                include: [{
                    model: ConsultationAttachments,
                    as: "consultation_attachments",
                    required: true,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }],
                distinct: true,
                order: [
                    ['id', 'DESC'],
                ],
                limit: limit,
                offset: offset
            }
            )
            console.log(consultations);
            responseHandler.successPaginatedDataResponse(res, consultations, page, limit, 'all consultation retrieved successfully')
        }
        else {
            responseHandler.unAuthorised(res)
        }
    } catch (error) {
        console.log(error)
    }
}

const getConsultationById = async (req, res, next) => {
    try {
        let consultation = await Consultations.getConsultationById({
            where: {
                id: req.params.id
            },
            include: [{
                model: ConsultationAttachments,
                as: "consultation_attachments",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }]
        })
        if (consultation) {
            responseHandler.successDataResponse(res, consultation, 'consultation retrieved successfully')
        } else {
            responseHandler.successDataResponse(res, consultation, 'no consultation found')
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