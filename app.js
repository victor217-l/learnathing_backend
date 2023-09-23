var  express = require('express');
var bodyparser = require('body-parser');
var multer = require('multer');
var signup = require('./controller/signup')
var verify = require('./controller/verify')
var login = require('./controller/login');
var post = require('./controller/post')
var comment = require('./controller/comment');
var like = require('./controller/like')
const fileupload = require('express-fileupload'); 

var http = require('http')
require('dotenv').config();



const app = express();

app.use(express.static('./public'))
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json());
app.use(fileupload({useTempFiles: true}))

const PORT = 3000 || process.env.PORT;

var server =  http.createServer(app)

app.use('/signup', signup)
app.use('/verify',verify)
app.use('/login',login)
app.use('/post',post)
app.use('/comment',comment)
app.use('/like',like)
server.listen(PORT, () => console.log(`server runing on ${PORT} `) )