const express = require('express');

const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/sms',(req,res,next)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            console.log(err,authData);
        }else{
            res.status(200).json({
                message:"outbound",
                data:req.body,
                authData:authData
            }); 
        }
    });
    
});

module.exports = router;