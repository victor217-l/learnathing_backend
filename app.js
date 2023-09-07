var  express = require('express');
var bodyparser = require('body-parser');
var multer = require('multer');
var signup = require('./controller/signup')
var verify = require('./controller/verify')
var login = require('./controller/login');
var post = require('./controller/post')

var http = require('http')
require('dotenv').config();



const app = express();

app.use(express.static('./public'))
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json());

const PORT = 3000 || process.env.PORT;

var server =  http.createServer(app)

app.use('/signup', signup)
app.use('/verify',verify)
app.use('/login',login)
app.use('/post',post)

server.listen(PORT, () => console.log(`server runing on ${PORT} `) )