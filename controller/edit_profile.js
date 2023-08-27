var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var db_query = require('../model/db_model');


router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())

router.post('/edit_profile', async (req,res) => {
     var username = req.body.username
     var email = req.body.email

     let result = await db_query.updatesignup(username,email)

     if(result.status == false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
     }else if(result.status == true){
        res.statusCode = 200;
        res.json({msg:"Profile edited"})
     }
} )






module.exports = router;