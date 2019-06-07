const express = require('express');

const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/sms',(req,res,next)=>{
            res.status(200).json({
                message:"outbound",
                data:req.body,
            }); 
});

module.exports = router;