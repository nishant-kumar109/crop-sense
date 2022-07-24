const express = require('express');
const router = express.Router();
const Joi = require('joi');
const JWT = require('../utils/jwt')

const authValidation = async (req, res, next) => {
    if (req.headers['authorization']) {
      var token = req.headers['authorization']
      // if (token.startsWith('Bearer ')) {
      //   token = token.slice(7, token.length);
        let verifyDetails =  JWT.verifyToken(token, req, res, next); 
        if (verifyDetails) {
          req["user"] = verifyDetails
        } else {
          await res.status(403).send({ "error": { status: 403, message: "UnAuthorized Access" } });
        }
      // }
    }else {
        await res.status(403).send({ "error": { status: 403, message: "Access token is not supplied" } });
    }
}

const validAdmin = async (req, res, next) => {
    if (req.headers['authorization']) {
      var token = req.headers['authorization']
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        let verifyDetails = JWT.verifyToken(token, req, res, next);
        console.log(verifyDetails); 
        if (verifyDetails.email && verifyDetails.role == 'admin') {
          req["user"] = verifyDetails
          next();
        } else {
          res.status(403).send({ "error": { status: 403, message: "UnAuthorized Access" } });
        }
      }
    } else {
        res.status(403).send({ "error": { status: 403, message: "UnAuthorized Access" } });
        next();
    }
}


module.exports = {
    authValidation,
    validAdmin
}