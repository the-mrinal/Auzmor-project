const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();

const databaseCheck = require('./api/routes/databasecheck');
const inbound = require('./api/routes/inbound');
const outbound = require('./api/routes/outbound');
const auth = require('./api/routes/auth');

const db = require('./db');
// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/inbound',verifytoken,inbound);
app.use('/outbound',verifytoken,outbound);
app.use('/login',auth);
app.use('/data',databaseCheck);

//verify token
function verifytoken(req,res,next){
    //get header val
    const headerVal = req.headers['authorization'];

    //cehck if undef
    if(typeof headerVal !== 'undefined' ){
        const val = headerVal.split(' ');
        const token = val[0];
        req.token = token;
        jwt.verify(req.token,'secretkey',(err,authData)=>{
            if(err){
                console.log(err,authData);
            }else{
                db.query("SELECT * from account where username=$1",[authData.username], (err, resp) => {
                    if (err) {
                      return next(err)
                    }
                    else if(resp.rows[0].auth_id==authData.password){
                        req.authData = resp.rows[0];
                        next();
                    }else{
                        res.sendStatus(403);
                    }
                })
            }
        });
    }else{
        //nooooo
        res.sendStatus(403);
    }
}
module.exports = app;