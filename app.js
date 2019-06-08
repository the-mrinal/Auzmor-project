
//importing required node modules
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();

//importing required myown defined modules
const inbound = require('./api/routes/inbound');
const outbound = require('./api/routes/outbound');
const auth = require('./api/routes/auth');
const db = require('./db');
// const error = require('./api/routes/error');
app.use(bodyParser.urlencoded({
    extended: true
 }));
 app.use(bodyParser.json());
//these app.use for the routes to redirect to specific place
app.use('/inbound',verifytoken,inbound);
app.use('/outbound',verifytoken,outbound);
app.use('/login',auth);

//verify token authentication
function verifytoken(req,res,next){
    //get header val
    const method = req.method;

    if(method=="POST"){
           //only post method is allowed
            const headerVal = req.headers['authorization'];

            //cehck if undef that means no authorisation
            if(typeof headerVal !== 'undefined' ){
                const val = headerVal.split(' ');
                const token = val[0];
                req.token = token;
             
                jwt.verify(req.token,'secretkey',(err,authData)=>{
                    // get the data from jwt tokens and match from databse table account
                    if(err){
                        console.log(err)
                        res.sendStatus(403);
                    }else{
                        db.query("SELECT * from account where username=$1",[authData.username], (err, resp) => {
                            //quesy the db to check
                            if (err) {//some error while quering
                         
                                res.sendStatus(405);
                            }
                            else if(resp.rows[0].auth_id==authData.password){//
                                //data fetched and match success
                                req.authData = resp.rows[0];
                                next();
                            }else{
                                //match failed wrong token
                           
                                res.sendStatus(403);
                            }
                        })
                    }
                });
            }else{
          
                //when no authorisation header is set
                console.log("no header!")
                res.sendStatus(403);
            }
    }else{
        //other than post method
        res.sendStatus(405);
    }
}
module.exports = app;
