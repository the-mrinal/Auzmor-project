const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();



const inbound = require('./api/routes/inbound');
const outbound = require('./api/routes/outbound');
const auth = require('./api/routes/auth');

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/inbound',verifytoken,inbound);
app.use('/outbound',verifytoken,outbound);
app.use('/login',auth);

//verify token
function verifytoken(req,res,next){
    //get header val
    const headerVal = req.headers['authorization'];

    //cehck if undef
    if(typeof headerVal !== 'undefined' ){
        const val = headerVal.split(' ');
        const token = val[0];
        req.token = token;
        next();
    }else{
        //nooooo
        res.sendStatus(403);
    }
}
module.exports = app;