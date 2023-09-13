var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var multer = require('multer')
var db_query = require('../model/db_model')
var jwt = require('jsonwebtoken')
const fs = require('fs');
var cloudinary = require('cloudinary')


router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())







// // Create a new instance of the Google Cloud Storage client
// // const storage = new Storage({
// //   keyFilename: 'path/to/your/credentials.json', // Replace with your credentials file path
// // });

// // const bucket = storage.bucket('your-bucket-name'); // Replace with your bucket name

// // const multerStorage = multer.memoryStorage();

// // const upload = multer({ storage: multerStorage });

// // // Upload route using multer
// // app.post('/upload', upload.single('file'), async (req, res) => {
// //   const file = req.file;

// //   if (!file) {
// //     return res.status(400).send('No file uploaded.');
// //   }

// //   const blob = bucket.file(file.originalname);
// //   const blobStream = blob.createWriteStream();

//   blobStream.on('error', (err) => {
//     console.error('Error uploading:', err);
//     res.status(500).send(err);
//   });





//   blobStream.end(file.buffer);
// });


// var storage =  multer.diskStorage({
//   destination: function(req,file,cb){
//     cb(null, "public/asset/images/upload_images")
//   },
//   filename: function(req,file,cb){
//     console.log(file)
//     cb(null,file.originalname)
//   }
// })


const firebase = require("firebase-admin");
const serviceAccount = require("../learnathing-84.json");





// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://tiktokcloneflutter-68673.appspot.com",
// });



// Initialize the Firebase Admin SDK
firebase.initializeApp({
  projectId: 'learnathing-843a8',
  credential: firebase.credential.cert(serviceAccount),
  storageBucket : 'gs://learnathing-843a8.appspot.com',

});

// Configure Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/asset/images/upload_images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

const upload = multer({ storage: storage });

// Create a route to upload images
router.post("/upload", upload.single("image"), async (req, res) => {

  var title = req.body.title;
  //var filename = req.file.filename;
  var username = req.body.username;
  var category = req.body.category;
 // var image = req.file.image;



  try {
    // Get the image file from the request
    const file = req.file;

    // If no files is uploaded, return an error
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Upload the file to Firebase Storage
    const bucket = firebase.storage().bucket("gs://learnathing-843a8.appspot.com");
    const uniqueFileName = `${Date.now()}_${file.originalname}`;
    const blob = bucket.file(uniqueFileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Error uploading the image.");
    });

    blobStream.on("finish", async ()  => {
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

       // res.status(200).json({ imageUrl });

       const user = 1;

      let result = await db_query.insertpost(username,user,imageUrl,title,category);
      if(result.status == false){
        res.statusCode = 500;
        res.json({msg:"Invalid credential"})
      }else if(result.status == true){
        res.statusCode = 200;
        res.json({msg: "post in", imageUrl: imageUrl})
      }
    

    });

    blobStream.end(file.buffer);
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }

 
});


// // Set up Multer storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Handle image upload
// router.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     // Upload the file to Firebase Storage
//     const bucket = admin.storage().bucket();
//     const uniqueFileName = `${Date.now()}_${file.originalname}`;
//     const blob = bucket.file(uniqueFileName);

//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });

//     blobStream.on("error", (err) => {
//       console.error(err);
//       res.status(500).send("Error uploading the image.");
//     });

//     blobStream.on("finish", () => {
//       const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//       res.status(200).json({ imageUrl });
//     });

//     blobStream.end(file.buffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error.");
//   }
// });





// cloudinary.config({ 
//   cloud_name: 'detjbvvp6', 
//   api_key: '459747664558291', 
//   api_secret: 'BJcWiKnmTPQ-b5zHNiwvNbPHNSY' 
// })

// const storage = multer.memoryStorage();
// //const upload = multer({ storage: storage });

// const upload = multer({ storage: storage, fileField: 'file' });


// // POST endpoint for image upload
// router.post('/upload11', upload.single('image'), async (req, res) => {
//   const imageBuffer = req.file.buffer;

//   try {
//     // Upload the image to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(req.file.path, {folder: "home"} , (error, results) => {
//         if (error) {
//           console.error(error);
//           console.error('Cloudinary Error:', error.message);
//           return reject(error);
//         } else {
//           // Return the Cloudinary URL of the uploaded image
//           return resolve({ status: true, imageUrl: results.secure_url });
//         }
//       });
//     });

//     if (result.status === true) {
//         res.status(200).json({ msg: "Image uploaded successfully", imageUrl: result.imageUrl });
//       }else{ 
     
//       res.status(500).json({ msg: "Image upload failed" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Image ffupload failed", error: error.message });
//   }
// });

 

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// Create a route that handles image uploads
// router.post("/upload", upload.single("image"), async (req, res) => {
//   // Get the file uploaded by the user
//   const file = req.file;

//   //const path = Buffer.from("my-file.jpg").toString();

//   const path = file.buffer.toString();

// //cloudinary.uploader.upload(path);
//   // Upload the file to Cloudinary
//   const result = await cloudinary.uploader.upload(path, {folder: "learnathing"});

//   // Return the Cloudinary response to the user
//   res.json(result);
// });




 router.post('/addpost',  authenticateToken, upload.single("images"), async (req,res) => {

  var title = req.body.title;
  //var filename = req.file.filename;
  var username = req.body.username;
  var category = req.body.category;
 // var image = req.file.image;


  if (!req.file) {
    res.statusCode = 400;
    res.json({ msg: "Image file is required" });
   // return;
  } 

  // Prepare the image for Cloudinary upload
  //const imageBuffer = req.file.buffer;

  // Upload the image to Cloudinary

  try {
    // Upload the image to Cloudinary and await the result
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(req.file.path, { folder: 'learnathing' }, (error, result) => {
        if (error) {
          console.error(error);
         return   reject(error); // Reject the promise on error
        //  res.json({msg:"Error"})
        } else {
        return  resolve(result); // Resolve the promise with the Cloudinary result on success
        //  res.json({msg:   "Succes"})
        }
      });
    });
  
    // Once the image is successfully uploaded to Cloudinary, insert the post into your database
    const insertResult = await db_query.insertpost(username, result.secure_url, title, category);
  
    if (insertResult.status == false) {
      res.statusCode = 500;
      res.json({ msg: "Invalid credential" });
    } else if (insertResult.status == true) {
      res.statusCode = 200;
      res.json({ msg: "Add post", list: insertResult.data });
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ error: 'Image upload or database insertion failed', cloudinaryError: error });
  }
  
  
})


router.get('/all_post', authenticateToken, async (req,res) => {
 
  let result = await db_query.getallpost()


      

  if(result.status == false){
    res.statusCode = 500;
    res.json({msg: "Invalid credential"})
  }else if(result.status == true){
    // const postsWithImageURLs = result.data.map(post => {
    //   const imageUrl = `/uploads/${post.postname}`;

    //   return {...post, imageUrl}
    // })

    res.statusCode = 200;
    res.json({msg:"All post ", list:result.data,})
  }

})

router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public/asset/images/upload_images', imageName);

  // Send the image file as a response
  res.sendFile(imagePath);
});


//userpost 
router.post('/user_post', authenticateToken, async (req,res) => {
  var username = req.body.username;

  let result = await db_query.getuserpost(username)
  if(result.status == false){
    res.statusCode = 500;
    res.json({msg:"Invalid credential"})
  }else if(result.status == true){
    
    res.statusCode = 200;
    res.json({msg:"users post", list:result.data, list2: postsWithImageURLs})
  }
})

//

// router.get('/all_post', authenticateToken, async (req, res) => {
//   let result = await db_query.getallpost();

//   if (result.status == false) {
//     res.statusCode = 500;
//     res.json({ msg: "Invalid credential" });
//   } else if (result.status == true) {
//     // Modify the response to include image URLs
//     const postsWithImageURLs = result.data.map(post => {
//       // Assuming post.imageFileName contains the filename of the uploaded image
//       const imageUrl = `/uploads/${post.imageFileName}`;
//       return { ...post, imageUrl };
//     });

//     res.statusCode = 200;
//     res.json({ msg: "All post", list: postsWithImageURLs });
//   }
// });


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


var uploadvideo = (req,res) => {
  cloudinary.Uploader.upload
}









module.exports = router;