var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next)=>{
  res.status(200).json({ status: "success", data: null, message: 'crop sense healthe is up' });
});

module.exports = router;
