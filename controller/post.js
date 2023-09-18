var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var multer = require('multer')
var db_query = require('../model/db_model')
var jwt = require('jsonwebtoken')
const fs = require('fs');
var cloudinary = require('cloudinary').v2
const fileupload = require('express-fileupload'); 
const util = require('util');
const cloudinaryUpload = util.promisify(cloudinary.uploader.upload_large);


router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())






const firebase = require("firebase-admin");
const serviceAccount = require("../learnathing-84.json");





// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://tiktokcloneflutter-68673.appspot.com",
// });



// Initialize the Firebase Admin SDK
// firebase.initializeApp({
//   projectId: 'learnathing-843a8',
//   credential: firebase.credential.cert(serviceAccount),
//   storageBucket : 'gs://learnathing-843a8.appspot.com',

// });



// Create a route to upload images
// router.post("/upload", upload.single("image"), async (req, res) => {

//   var title = req.body.title;
//   //var filename = req.file.filename;
//   var username = req.body.username;
//   var category = req.body.category;
//  // var image = req.file.image;



//   try {
//     // Get the image file from the request
//     const file = req.file;

//     // If no files is uploaded, return an error
//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     // Upload the file to Firebase Storage
//     const bucket = firebase.storage().bucket("gs://learnathing-843a8.appspot.com");
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

//     blobStream.on("finish", async ()  => {
//       const imageUrl = `${blob.name}`;
//       //https://storage.googleapis.com/${bucket.name}/

//        // res.status(200).json({ imageUrl });

//        const user = 1;

//       let result = await db_query.insertpost(username,user,blob.name,title,category);
//       if(result.status == false){
//         res.statusCode = 500;
//         res.json({msg:"Invalid credential"})
//       }else if(result.status == true){
//         res.statusCode = 200;
//         res.json({msg: "post in", imageUrl: imageUrl})
//       }
    

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



cloudinary.config({ 
  cloud_name: 'detjbvvp6', 
  api_key: '459747664558291', 
  api_secret: 'BJcWiKnmTPQ-b5zHNiwvNbPHNSY' 
})

const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

//const upload = multer({ storage: storage });
const upload = multer({
  fileFilter: function(req, file, cb) {
    // Check if the image file is too large.
    if (file.size > 1000000) {
      cb(new Error('Image file is too large'));
      return;
    }

    // Check if the image file is in a supported format.
    const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
    if (!supportedFormats.includes(file.mimetype)) {
      cb(new Error('Image file is in an invalid format'));
      return;
    }

    // The image file is valid.
    cb(null, true);
  }
});


router.post('/addpost',  authenticateToken,  async (req,res) => {

 // upload.single("image")
  var title = req.body.title;
  //var filename = req.file.filename;
  var username = req.body.username;
  var category = req.body.category;
  var user = '1';
 // var image = req.file.image;

 

  // Prepare the image for Cloudinary upload
  //const imageBuffer = req.file.buffer;

  // Upload the image to Cloudinary

  const file = req.files.image;



  
 
try {
  // Upload the image to Cloudinary and await the result
   const cloudinaryResult  =  await cloudinaryUpload(file.tempFilePath, {
    folder: 'learnathing',
    resource_type: 'auto',
  //  format: 'auto',
  }); //await new Promise((resolve, reject) => {
  //   cloudinary.uploader.upload_large(file.tempFilePath, {folder: 'learnathing',
  //   resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
  //   format: 'auto', }, (error, result) => {
  //     if (error) {
  //       console.error(error);
  //       return reject({status: false})// Reject the promise on error
  //     } else {
  //       return resolve({status: true, data:result}); // Resolve the promise with the Cloudinary result on success
  //     }
  //   });
  // });
  

  
  if(cloudinaryResult.status.secure_url){
    console.log(cloudinaryResult)
   
  let resultt = await db_query.insertpost(username,user,cloudinaryResult.data.secure_url,title,category);
  console.log(cloudinaryResult.data.secure_url);
  if(resultt.status === false){
    res.statusCode = 500;
    res.json({msg:"Invalid credential"})
    }else{
    res.statusCode = 200;
    res.json({msg: "post in", imageUrl: cloudinaryResult.data.secure_url})
    }
  }else{
    res.statusCode = 500;
    res.json({msg:`Invalid credential : ${cloudinaryResult.error.message}`})
  }


} catch (error) {
  // Handle the Cloudinary uploader error
  if (error.http_code === 400 && error.message.includes("Missing required parameter")) {
    res.statusCode = 400;
    res.json({ msg: "Image upload failed: " + error.message });
  } else {
    res.statusCode = 500;
    res.json({ msg: "Image upload failed: An internal server error occurred" + error.message  });
  }
}

});


  // try {
  //   // Upload the image to Cloudinary and await the result
  //   const cloudinaryResult = await new Promise((resolve, reject) => {
  //     cloudinary.uploader.upload_large(file.tempFilePath, { folder: 'learnathing' }, (error, result) => {
  //       if (error) {
  //         console.error(error);
  //         return reject({ status: false, error }); // Reject the promise on error and include the error details
  //       } else {
  //         return resolve({ status: true, data: result }); // Resolve the promise with the Cloudinary result on success
  //       }
  //     });
  //   });
  
  //   if (cloudinaryResult.status === true) {
  //     // Image upload to Cloudinary succeeded
  //     console.log(cloudinaryResult);
  //     const resultt = await db_query.insertpost(username, user, cloudinaryResult.data.secure_url, title, category);
  
  //     if (resultt.status === false) {
  //       res.statusCode = 500;
  //       res.json({ msg: "Invalid credential" });
  //     } else {
  //       res.statusCode = 200;
  //       res.json({ msg: "Post created", imageUrl: cloudinaryResult.data.secure_url });
  //     }
  //   } else {
  //     // Image upload to Cloudinary failed
  //     res.statusCode = 500;
  //     res.json({ msg: `Image upload failed: ${cloudinaryResult.error.message}` });
  //   }
  // } catch (error) {
  //   // Handle other errors, such as network issues or unexpected exceptions
  //   console.error(error);
  //   res.statusCode = 500;
  //   res.json({ msg: "An internal server error occurred" });
  // }

 


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