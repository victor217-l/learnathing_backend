var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser')
var jwt = require('jsonwebtoken')
var db_query = require('../model/db_model');
const { check, validationResult } = require('express-validator');
require('dotenv').config()

router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())

router.post('/', [check('email').notEmpty().withMessage('email field empty'),
check('password').notEmpty().withMessage('password field is empty')], async (req,res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.json({error: errors.array()})
    }

    var email = req.body.email;
    var password = req.body.password;

    var login = {
        email: email,
        password: password
    }

    const accesstoken = generateaccestoken(login);
    const refreshtoken = jwt.sign(login, process.env.REFRESH_TOKEN_SECRET);

    if(email && password){

        let result = await db_query.getuserlogin(email,password);

        if(result.status == false){
            res.statusCode = 500;
            res.json({msg:"Invalid credential"})
            
        }else if(result.status == true){
            if(result.data.length > 0){
                var email3 = result.data[0].email
                var user_id = result.data[0].id;
                var username = result.data[0].username;

                res.json({msg:"Login succesful", accesstoken: accesstoken, 
                user_id: user_id,
                username: username,
                email: email3, refreshtoken:refreshto,ken})
            }else{
                res.statusCode = 500;
                res.json({msg: "Invalid credential"})

            }
        }
    }else{
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
    }

})



function generateaccestoken(login) {
    return jwt.sign(login, process.env.ACCESS_TOKEN_SECRET)

}

module.exports = router