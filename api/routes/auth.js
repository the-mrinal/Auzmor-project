const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/',(req,res,next)=>{
    username = req.body.username;
    password = req.body.password;
    // username = "mrinal";
    // auth_id="123r";

    jwt.sign({username:username,password:password},'secretkey',(err,token)=>{
        res.json({
            token:token
        });
    });

})
module.exports = router;