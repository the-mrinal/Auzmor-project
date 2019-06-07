const express = require('express');

const jwt = require('jsonwebtoken');
const router = express.Router();

const db = require('../../db');
router.post('/sms',validation,(req,res,next)=>{
    if(req.status == 0){
        res.status(403).json(req.statusMsg);
    }else{
        res.status(200).json({
            message:"outbound sms ok"
        }); 
    } 
});

function validation(req,res,next){
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
            //parameter invalid
            status =0;
            msg.push({error: "msg is invalid"});
        }
    }
    //min 6 max 16 for to and from



    db.query("SELECT * from phone_number where number=$1 and account_id=$2",[from,req.authData.id], (err, resp) => {
        if (err) {
          return next(err)
        }
        else if(resp.rows.length !=0){
            req.status = status;
            req.statusMsg = msg;
            next();
        }else{
            //parameter not found
            status =0;
            msg.push({error: "from parameter not found"});
            req.status = status;
            req.statusMsg = msg;
            next();
        }
    });
}

module.exports = router;