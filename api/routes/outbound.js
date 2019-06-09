//importing required node modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const redis = require('redis');
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
        //all ok then
        res.status(200).json({
            message:"outbound sms ok"
        }); 
    } 
});

function validation(req,res,next){
    //this function is used for all the validation stuff
    //set the status as 1 will change it to 0 if any validation fails
    var status =1;
    var msg= [];
    var dbcheck =0;
    if(typeof req.body.to === "undefined"){
        //parameter missing
        status =0;
        msg.push({error: "to is missing"});
    }
    else{
        
        var to = req.body.to;
        console.log(to.length,typeof to);
        if(to.length>16 || to.length <6){
                //min 6 max 16 for to and from
            //parameter invalid
            status =0;
            console.log(to+status);
            msg.push({error: "to is invalid"});
        }
    }
    if(typeof req.body.from === "undefined"){
        //parameter missing
        status =0;
        msg.push({error: "from is missing"});
    }
    else{
        var from = req.body.from;
            
        if((from.length>16 || from.length <6)){
                //min 6 max 16 for to and from
            //parameter invalid
            status =0;
            msg.push({error: "from is invalid"});
        }else{
            dbcheck=1;
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
                //min 1 max 120 
            //parameter invalid
            status =0;
            msg.push({error: "msg is invalid"});
        }
    }


        if(dbcheck==1){
            //check the to number and authData.id 
        //make sure the sms reached to the person intented to
        db.query("SELECT * from phone_number where number=$1 and account_id=$2",[from,req.authData.id], (err, resp) => {
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
                msg.push({error: "from parameter not found"});      
                req.Msgstatus = status;
                req.statusMsg = msg;
                console.log(status,msg);
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
    //cache set and verified here
    if(req.Msgstatus ==1){
        var to = req.body.to;
        var from = req.body.from;
        var msg = [];
        
         //rate limiter function using redis
        const token = from 
        // get the unique identifier from the user here
        redis_client
            .multi() // starting a transaction
            // Set a redis key (token) with value 0 if it doesnt exist already and expiry as 60sec
            .set([token, 0, 'EX', 86400, 'NX']) // SET UUID 0 EX 60 NX
            .incr(token) // INCR tokrn
            .exec((err, replies) => {
            if (err) {
                return res.status(500).send(err.message)
            }
            const reqCount = replies[1]
            if (reqCount > 50) { //if limit reached
                msg = {error:"limit reached for from "+from}
                req.Msgstatus = 0;
                req.statusMsg = [msg];
                next();
            }
        });
        
        redis_client.get(to, function (err, data) {
            //checking to and from pair in the blocklist
            if (err) throw err;

            if (data != null && data == from) {
                //data is prese and the to from pair both matched
                //blocked then
                console.log("blocked"+data);
                msg = {error:"sms from "+from+" to "+to+" is blocked by STOP request."}
                req.Msgstatus = 0;
                req.statusMsg = [msg];
                next();
            } else {
                //not blocked
                next();
            }
        });
    }else{
        next();
    }
}

module.exports = router;
