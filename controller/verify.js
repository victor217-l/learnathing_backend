var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var db_query = require('../model/db_model')

router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())


router.post('/', async function(req,res) {
    var id = req.body.id;
    var token = req.body.token;

    let result = await db_query.matchtoken(id,token);

    if(result.status == false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
    }else if(result.status == true){
        if(result.data.length > 0){
            var email = result.data[0].email
            var email_status = "verified";
            let result2 = await db_query.updatesignup(email,email_status);
            console.log(email)

            if(result2.status == false){
                res.statusCode = 500;
                res.json({msg:"Invaliad crdential"} )
            }else if(result2.status == true){
                res.statusCode = 200;
                res.json({msg:"Email Verified"})
            }

        }else{
            res.statusCode = 500;
            res.json({msg:"invalid credential"})
        }
    } 


})


module.exports = router;