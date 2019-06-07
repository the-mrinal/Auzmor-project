const express = require('express');
const app = express();
app.use((req,res,nxt)=>{
    res.status(200).json({
        message:"looks cool"
    });
});

module.exports = app;