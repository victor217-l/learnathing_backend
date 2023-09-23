const express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken')
var db_query = require('../model/db_model');
require('dotenv').config()

router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())


router.post('/',  authenticateToken, async (req,res) => {
    var username = req.body.username;
    var comment = req.body.comment
    var postid = req.body.postid;
    var pserson_id = req.body.person_id;

    let result = await db_query.sendcomment(comment,username,postid,pserson_id);

    if(result.status == false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
    }else if(result.status == true){
        res.statusCode = 200;
        res.json({msg:"comment in", list:result.data})
    }
    

})


router.post('/all_comment', authenticateToken, async (req,res) => {
    var postid = req.body.postid;

    let result = await db_query.seeallcomment(postid)

    if(result.status == false){
        res.statusCode = 500
        res.json({msg:"Invalid credential"})
    }else if(result.status == true){
        res.statusCode = 200;
        res.json({msg:"all post"})
    }

})


function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
      return  res.sendStatus(401)//unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err){
            return res.sendStatus(403) //forbidden
        }
        req.user = user;
        next()
    })
}

module.exports = router;