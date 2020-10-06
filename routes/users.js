const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/profile')


router.post('/profile',(req, res, next)=> {
  // console.log('req==== body', req.body)
  userController.createUserProfile(req, res);
});

module.exports = router;
