const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/profile')
const Joi = require('joi');
const {validAdmin, authValidation} = require('../middleware/authmiddleware')

const profileSchema = Joi.object().keys({
  "first_name": Joi.string().required(),
  "last_name": Joi.string().required(),
  "email": Joi.string().required(),
  "password": Joi.string().required(),
  "mobile_number": Joi.string(),
  "region" : Joi.string(),
  "role": Joi.string().valid("farmer", "doctor", "admin").required(),
  "total_exprience" : Joi.number(),
  "about_me" : Joi.string()
})


router.post('/profile',(req, res, next)=> {
  profileSchema.validate(req.body);
  authValidation(req,res);
  userController.createUserProfile(req,res)
});

router.get('/profile', (req,res,next) => {
    authValidation(req,res)
  userController.getProfile(req, res)
})

router.get('/profile/:id', (req,res,next) => {
  authValidation(req,res)
userController.getOneProfileByUserId(req, res)
})

router.put('/profile', (req,res,next) => {
  profileSchema.validate(req.body);
  authValidation(req,res)
  userController.editUserProfile(req,res)  
})

router.get('/all-profile', (req,res,next)=>{
  authValidation(req,res)
  userController.getAllUserProfile(req,res)
})

router.delete('/profile', (req,res,next) => {
  userController.deleteUserProfile(req, res)
})

module.exports = router;
