const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/profile')
const Joi = require('joi');

const profileSchema = Joi.object().keys({
  "first_name": Joi.string().required(),
  "last_name": Joi.string().required(),
  "email": Joi.string().required(),
  "password": Joi.string().required(),
  "mobile_number": Joi.string(),
  "region" : Joi.string(),
  "role": Joi.string().valid("farmer", "doctor", "admin").required()
})


router.post('/createProfile',(req, res, next)=> {
  console.log('api hitting ===', req.body)
  profileSchema.validate(req.body);
  userController.createUserProfile(req,res)
});

router.get('/getProfile', (req,res,next) => {
    console.log('req==== body', req.body)
  userController.getUserProfile(req, res)
})


router.put('/editProfile', (req,res,next) => {
  profileSchema.validate(req.body);
  userController.editUserProfile(req,res)  
})


router.delete('/deleteProfile', (req,res,next) => {
  userController.deleteUserProfile(req, res)
})

module.exports = router;
