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


//   var cloudinaryy = cloudinary.config({ 
//   cloud_name: 'detjbvvp6', 
//   api_key: '459747664558291', 
//   api_secret: 'BJcWiKnmTPQ-b5zHNiwvNbPHNSY' 
// })





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

//  var upload = multer({storage: storage})


// const imagePath = 'public/asset/images/upload_images'; // Replace with the path to your image file
// const options = { folder: 'learnathing' }; // Optional: Set a folder in your Cloudinary account

// cloudinary.uploader.upload(imagePath, options, (error, result) => {
//   if (error) {
//     console.error(error);
//     // Handle the error, e.g., send an error response to the client
//   } else {
//     console.log(result);
//     // The result object contains the uploaded image details, including the public URL
//     // You can send this URL back to the client or use it as needed
//   }
// });


cloudinary.config({ 
  cloud_name: 'detjbvvp6', 
  api_key: '459747664558291', 
  api_secret: 'BJcWiKnmTPQ-b5zHNiwvNbPHNSY' 
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// POST endpoint for image upload
router.post('/upload', upload.single('image'), (req, res) => {
  const imageBuffer = req.file.buffer;

  // Upload the image to Cloudinary
  cloudinary.uploader.upload(req.file.path,{ folder: 'learnathing' }, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Image upload failed' });
    } else {
      // Return the Cloudinary URL of the uploaded image
      return res.status(200).json({ imageUrl: result.secure_url });
    }
  })
});



 

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
        //  res.json({msg:"Succes"})
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
    res.json({msg:"All post ", list:result.data, list: postsWithImageURLs})
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
    const postsWithImageURLs = result.data.map(post => {
      const imageUrl = `/uploads/${post.imageFileName}`;

      return {...post, imageUrl}
    })
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