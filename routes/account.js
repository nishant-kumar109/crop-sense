const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account')
const Joi = require('joi');


const signUpSchema = Joi.object().keys({
    "first_name": Joi.string().required(),
    "last_name": Joi.string().required(),
    "email": Joi.string().required(),
    "password": Joi.string().required(),
    "mobile_number": Joi.string(),
    "region" : Joi.string(),
    "role": Joi.string().valid("farmer", "doctor", "admin").required()
})
  
const loginSchema = Joi.object().keys({
"email" : Joi.string().required(),
"password" : Joi.string().required()
})


router.post('/signup', (req, res, next) => {
signUpSchema.validate(req.body);
accountController.signUpUser(req, res)
})


router.post('/login', (req,res, next) => {
loginSchema.validate(req.body);
accountController.logInUser(req,res)
});
  
module.exports = router;
