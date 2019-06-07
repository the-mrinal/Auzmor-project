const express = require('express');

const router = express.Router();

router.post('/sms',(req,res,next)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            console.log(err,authData);
        }else{
            res.status(200).json({
                message:"inbound",
                data:req.body,
                authData:authData
            }); 
        }
    });
});

module.exports = router;