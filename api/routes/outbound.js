const express = require('express');

const router = express.Router();

router.post('/sms',(req,res,next)=>{
    res.status(200).json({
        message:"outbound sms"
    }); 
});

module.exports = router;