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
    var postid = req.body.postid;
    var user_id = req.body.user_id;
    var action = req.body.action;//like or unlike
    //liked is 1 unlike is 0

    try{
        if(action === 'like'){
            let result1 = await db_query.toseeifalreadylike(user_id,postid);

            // if(result1.status == true){
            //     res.statusCode = 500;
            //     res.json({msg:"its all like"})
            // }else if(result1.status == false){
                if(result1.data.length === 0){
                    let result2 = await db_query.insertintolike(user_id,postid,true)

                    if(result2.status == false){
                        res.statusCode = 500;
                        res.json({msg:"Invalid credent"})
                    }else if(result2.status == true){
                        res.statusCode = 200;
                        res.json({msg:"Liked post successfully"})
                    }

                    
                // }else{
                //     res.statusCode = 500;
                //     res.json({msg:"Inv crdential"})
                // }
                
            }

        }else if(action === 'unlike'){
            let result3 = await db_query.removecolumn(user_id,postid);

            // if(result3.status == false){
            //     res.statusCode = 500;
            //     res.json({msg:"Inv crdential"})
            // }else if(result3.status == true){
            //     if(result3.data.length > 0){

                    if(result3.data[0].affectedRows === 0 && result3.status == false){
                        res.statusCode = 404;
                        res.json({msg:"User has not liked post "})
                    }else if(result3.status == true){
                        res.statusCode = 200;
                        res.json({msg:"Unliked successfull"})
                    }                    
                // }else{
                //     res.statusCode = 500;
                //     res.json({msg:"Inavlid action"})
                // }
           // }

        }
    }catch(e){
        console.error('Error:', e);
        res.status(500).json({ message: 'Internal server error.' });
    }

})

router.post('/like', async (req, res) => {
    const { user_id, liked_user_id, action } = req.body;
  
    const connection = await pool.getConnection();
  
    try {
      if (action === 'like') {
        // Check if the user has already liked the target user
        const [rows] = await connection.query(
          'SELECT * FROM user_likes WHERE user_id = ? AND liked_user_id = ?',
          [user_id, liked_user_id]
        );
  
        if (rows.length === 0) {
          // User hasn't liked the target user yet, insert a like record
          await connection.query(
            'INSERT INTO user_likes (user_id, liked_user_id, liked) VALUES (?, ?, true)',
            [user_id, liked_user_id]
          );
          res.json({ message: 'Liked user successfully.' });
        } else {
          // User has already liked the target user, return an error
          res.status(400).json({ message: 'User has already liked this user.' });
        }
      } else if (action === 'unlike') {
        // Delete the like record for the specified user and target user
        const result = await connection.query(
          'DELETE FROM user_likes WHERE user_id = ? AND liked_user_id = ?',
          [user_id, liked_user_id]
        );
  
        if (result[0].affectedRows === 0) {
          res.status(400).json({ message: 'User has not liked this user.' });
        } else {
          res.json({ message: 'Unliked user successfully.' });
        }
      } else {
        res.status(400).json({ message: 'Invalid action.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    } finally {
      connection.release();
    }
  });

router.post('/all_like', authenticateToken, async (req,res) => {

    

    let result = await db_query.seeallcomment()

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