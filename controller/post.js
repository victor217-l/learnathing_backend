var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var multer = require('multer')
var db_query = require('../model/db_model')
var jwt = require('jsonwebtoken')
const fs = require('fs');



router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())





// Create a new instance of the Google Cloud Storage client
// const storage = new Storage({
//   keyFilename: 'path/to/your/credentials.json', // Replace with your credentials file path
// });

// const bucket = storage.bucket('your-bucket-name'); // Replace with your bucket name

// const multerStorage = multer.memoryStorage();

// const upload = multer({ storage: multerStorage });

// // Upload route using multer
// app.post('/upload', upload.single('file'), async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const blob = bucket.file(file.originalname);
//   const blobStream = blob.createWriteStream();

//   blobStream.on('error', (err) => {
//     console.error('Error uploading:', err);
//     res.status(500).send(err);
//   });





//   blobStream.end(file.buffer);
// });


var storage =  multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, "public/asset/images/upload_images")
  },
  filename: function(req,file,cb){
    console.log(file)
    cb(null,file.originalname)
  }
})

var upload = multer({storage: storage})


router.post('/addpost',  authenticateToken, upload.single("image"), async (req,res) => {

  var title = req.body.title;
  //var filename = req.file.filename;
  var username = req.body.username;
  var category = req.body.category;
  
  let result = await db_query.insertpost(username,req.file.filename,title,category);
  
  if(result.status == false){
    res.statusCode = 500;
    res.json({msg:"Invalid credential"})
  }else if(result.status == true){
    res.statusCode = 200;
    res.json({msg:"Add post", list:result.data })
  }

})


router.get('/all_post', authenticateToken, async (req,res) => {
 
  let result = await db_query.getallpost()

  if(result.status == false){
    res.statusCode = 500;
    res.json({msg: "Invalid credential"})
  }else if(result.status == true){
    res.statusCode = 200;
    res.json({msg:"All post ", list:result.data})
  }

})

//userpost
router.post('/user_post', authenticateToken, async (req,res) => {
  var username = req.body.username;

  let result = await db_query.getuserpost(username)
  if(result.status == false){
    res.statusCode = 500;
    res.json({msg:"Invalid credential"})
  }else if(result.status == true){
    res.statusCode = 200;
    res.json({msg:"users post", list:result.data})
  }
})

//

function authenticateToken(req,res,next)  {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null){
    return res.sendStatus(401)//unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err,user) => {
    if(err){
      res.sendStatus(403)//forbidden
    }
    req.user = user;
    next()
  })
}










module.exports = router;