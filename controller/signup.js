var express = require('express');
var router =  express.Router();
var bodyparser = require('body-parser');
var db_query = require('../model/db_model');
var nodemailer= require('nodemailer')
var multer = require('multer')
const { check, validationResult } = require('express-validator');
const randomToken = require('random-token');


router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())


router.post('/', [check('username').notEmpty().withMessage('username field is empty'),
check('email').notEmpty().withMessage('email field is empty'), 
check('password').notEmpty().withMessage('password field is empty')], async (req,res) => {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var emailstatus = "not_verified";

    let result = await db_query.signup(username,email,password,emailstatus);

    if(result.status == false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
    }else if(result.status == true){
        var token = randomToken(6)

        console.log(token)
        let result1 = await db_query.verifyemail(username,email,token);

        if(result1.status == false){
            res.statusCode = 500;
            res.json({msg:"Error on token"})
        }else if(result1.status == true){

            let result2 = await db_query.getuserid(email);

            if(result2.status == false){
                res.statusCode = 500;
                res.json({msg:"Invalid credential"})
            }else if(result2.status == true){
                if(result2.data.length > 0){

                    var id = result2.data[0].id;

                    var output = `<p> Dear ${username}, </p>
                     <p> Thanks for sign up. Your verification id 
                     and token is given below; </p> 
                     <ui>
                     <li> User ID: ${id}  </li>
                     <li> Token: ${token} </li>
                     </ul>
                     <p>verify link : <a hreft = "http://localhost:3000/verify">Verify </a> </p>
                     <p><b> This is automatically generated mail</b></p>
             
                     `;

                     var transport = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "victoribeojo8@gmail.com",
                            pass:"tjhdefqtnllqsqqm",
                        }
                     })

                     var mailOptions = {
                        from: 'Hms@gmail.com',
                        to:email,
                        subject: 'Email verificarion',
                        html: output
                     };
                     
                     transport.sendMail(mailOptions, function(err,info){
                        if(err){
                            return console.log(err)
                        }
                        console.log(info)
                     })


                    res.statusCode = 200;
                     res.json({status: 200, list: result.data, msg:"check your email to vrify"})

                }else{
                    res.statusCode = 500;
                    res.json({msg:"invalid crdential"})
                }
            }

           
        }
        
    }
}) 


router.post('/getuserinformation', async (req,res) => {
    var email = req.body.email;
    var userinform = req.body.userinform;

    let result = await db_query.insertinform(email,userinform);

    if(result.status ==false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
    }else if(result.status == true){
        res.statusCode = 200;
        res.json({msg:"user inserted", list:result.data})
    }
} )

var storage =  multer.diskStorage({
    destination: function(re,file,cb){
        cb(null,"public/asset/images/upload_images")
    },
    filename: function(req,file,cb){
        console.log(file)
        cb(null, file.originalname)
    }
})

var upload = multer({storage:storage})

router.post('/add_userpost', upload.single("image"), async (req,res) => {
    
    var username = req.body.username;

    let result = await db_query.userpostname(req.file.filename,username);

    if(result.status == false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
    }else if(result.status == true){
        res.statusCode = 200;
        res.json({msg:"Post insert", list:result.data})
    }
} )

module.exports = router;