const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultation/consultation')
const Joi = require('joi');
const {validAdmin, authValidation} = require('../middleware/authmiddleware')
const consultationSchema = Joi.object().keys({
  doctor_id : Joi.string().required(),
  crop_type : Joi.string().required(),
  crop_name:  Joi.string().required(),
  disease_name : Joi.string(),
  disease_local_name : Joi.string(),
  region:            Joi.string().required(),
  temprature_range : Joi.string(),
  humidity_percentage : Joi.string(),
  rain_fall : Joi.string(),
  soil_type : Joi.string().required(),
  farmer_worries : Joi.string().required(),
  start_date : Joi.date(),
  end_date : Joi.date(),
  consultation_attachments :  Joi.array().items(
    Joi.object({
      file_url: Joi.string().required(),
      file_type: Joi.string().valid('image', 'video')
    }),
  )
})

const editConsultaionSchema = Joi.object().keys({
  disease_name : Joi.string().required(),
  doctor_solution : Joi.string().required(),
  consultation_date : Joi.date().required(),
  doctor_accepted : Joi.boolean()
})


router.post('/create',(req, res, next)=> {
     consultationSchema.validate(req.body);
    authValidation(req,res);
    consultationController.createConsultaion(req,res)
  });

router.put('/edit', (req,res,next)=>{
  editConsultaionSchema.validate(req.body);
  authValidation(req,res);
  consultationController.updateConsultation(req,res)
})

router.get('/allConsultation', (req, res, next) => {
  authValidation(req,res);
  consultationController.getAllConsultation(req,res)
// next(error)
})

router.get('/:id', (req,res,next) =>{
  authValidation(req,res);
  consultationController.getConsultationById(req,res)
})
module.exports = router;