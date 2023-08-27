var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var db_query = require('../model/db_model')


router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json()) 



module.exports = router;