//importing required node modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const redis = require('redis');
const app = express();
//setting up redis port
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(REDIS_PORT);
//importing required myown defined modules
const db = require('../../db');



router.post('/sms',validation,cache,(req,res,next)=>{
            if(req.Msgstatus == 0){
                //if 0 that means the middleware function returns the result as error
                res.status(200).json(req.statusMsg[0]);
            }else{
                res.status(200).json({
                    message:"inbound sms ok"
                }); 
            }
            
});


function validation(req,res,next){
    //this function is used for all the validation stuff
    var status =1;//set the status as 1 will change it to 0 if any validation fails
    var msg= [];//initilise for the error msgs
    var dbcheck = 0;
    if(typeof req.body.to === "undefined"){
        //parameter missing
        status =0;
        msg.push({error: "to is missing"});
    }
    else{
        var to = req.body.to;
        if((to.length>16 || to.length <6)){
            //parameter invalid
            status =0;
            msg.push({error: "to is invalid"});
        }else{
            dbcheck = 1;
        }
    }
    
    if(typeof req.body.from === "undefined"){
        //parameter missing
            //min 6 max 16 for to and from
        status =0;
        msg.push({error: "from is missing"});
    }
    else{
        var from = req.body.from;
            
        if((from.length>16 || from.length <6)){
            //parameter invalid
                //min 6 max 16 for to and from
            status =0;
            msg.push({error: "from is invalid"});
        }
    }
    if(typeof req.body.text === "undefined"){
        //parameter missing
        status =0;
        msg.push({error: "msg is missing"});
    }
    else{
        var text = req.body.text;
        if(text.length<1 || text.length>120){
            //parameter invalid
            status =0;
            msg.push({error: "msg is invalid"});
        }
    }
   
    if(dbcheck==1){
            //check the to number and authData.id 
        //make sure the sms reached to the person intented to
        db.query("SELECT * from phone_number where number=$1 and account_id=$2",[to,req.authData.id], (err, resp) => {
            if (err) {
                console.log("this")
            return next(err)
            }
            else if(resp.rows.length !=0){
                //true
 
                req.Msgstatus = status;
                req.statusMsg = msg;
                next();
                //matched the account and to number
            }else{
                //parameter not found
                //false
                status =0;
                msg.push({error: "to parameter not found"});      
                req.Msgstatus = status;
                req.statusMsg = msg;
                next();
            }
        });
    }else{

        req.Msgstatus = status;
        req.statusMsg = msg;
        next();
    }

   
}
function cache(req,res,next){
    //cache set here
    if(req.Msgstatus ==1){
        var msg = req.body.text;
        if(msg.replace(/[\n\t\r]/g,"")=="STOP"){ //trims and checks all condition of stop mentioned
            //set the from to key pair in here for 4 hours
            redis_client.setex(req.body.from,14400, req.body.to);
            console.log('saved');
        }
    }
    next();
}
module.exports = router;