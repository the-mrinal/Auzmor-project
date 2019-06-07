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
    if(req.status == 0){
        //if 0 that means the middleware function returns the result as error
        res.status(403).json(req.statusMsg);
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
    if(typeof req.body.to === "undefined"){
        //parameter missing
        status =0;
        msg.push({error: "to is missing"});
    }
    else{
        var to = req.body.to;
        if((to.length>16 && to.length <6)){
                //min 6 max 16 for to and from
            //parameter invalid
            status =0;
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
            
        if((from.length>16 && from.length <6)){
                //min 6 max 16 for to and from
            //parameter invalid
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
        if(text.length<1 && text.length>120){
                //min 1 max 120 
            //parameter invalid
            status =0;
            msg.push({error: "msg is invalid"});
        }
    }



    //check the to number and authData.id 
    //make sure the sms initiated from the person intented to
    db.query("SELECT * from phone_number where number=$1 and account_id=$2",[from,req.authData.id], (err, resp) => {
        if (err) {
          return next(err)
        }
        else if(resp.rows.length !=0){
            //both the nmber account and user account matched
            req.status = status;
            req.statusMsg = msg;
            next();
        }else{
            //parameter not found
            //no match
            status =0;
            msg.push({error: "from parameter not found"});
            req.status = status;
            req.statusMsg = msg;
            next();
        }
    });
}

function cache(req,res,next){
    //cache set and verified here
    var to = req.body.to;
    var from = req.body.from;
    var msg = [];
    redis_client.get(from, function (err, data) {
        //to check api call limit of from number 
        if (err) throw err;

        if (data != null && data > 50) {
            //is thats greater than 50 limit crossed!!!
            msg = {error:"limit is reached from "+from}
            req.status = 0;
            req.statusMsg = msg;

        } else if(data != null && data <=50) {
            //not greater than 50
            redis_client.INCR(from);

        }else{
            //first time 
            //set 24hr timer
            redis_client.setex(from, 86400, 1);
        }
    });
    redis_client.get(to, function (err, data) {
        //checking to and from pair in the blocklist
        if (err) throw err;

        if (data != null && data == from) {
            //data is prese and the to from pair both matched
            //blocked then
            console.log(data);
            msg = {error:"sms from "+from+" to "+to+" is blocked by STOP request."}
            req.status = 0;
            req.statusMsg = msg;
            next();
        } else {
            //not blocked
            next();
        }
    });
}

module.exports = router;