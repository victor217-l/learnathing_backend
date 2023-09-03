const express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var db_query = require('../model/db_model');

router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())


router.post('/', async (req,res) => {
    var username = req.body.username;
    var comment = req.body.comment
    var postid = req.body.postid;
    var pserson_id = req.body.person_id;

    

})

module.exports = router;