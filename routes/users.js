const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/profile')


router.post('/profile',(req, res, next)=> {
  // console.log('req==== body', req.body)
  userController.createUserProfile(req, res);
});

router.get('/getProfile', (req,res,next) => {
    console.log('req==== body', req.body)
  userController.getUserProfile(req, res)
})


router.put('/editProfile', (req,res,next) => {
  userController.editUserProfile(req,res)
})

router.delete('/deleteProfile', (req,res,next) => {
  userController.deleteUserProfile(req, res)
})

module.exports = router;
