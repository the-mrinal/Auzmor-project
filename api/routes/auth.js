//importing required node modules
const express = require('express'); 
const jwt = require('jsonwebtoken');
const router = express.Router();

//importing required myown defined modules
const db = require('../../db');

router.post('/',(req,res,next)=>{ 
    //fetching the username and password from user
    username = req.body.username; 
    password = req.body.password;
     //check if that username is present in the db and if yes then return the auth_id
     db.query("SELECT auth_id from account where username=$1",[username], (err, resp) => {
        if (err) {
          return next(err)
        }
        else if(resp.rows.length !=0){//if auth_id is there for that username
            if(resp.rows[0].auth_id == password){//match with the password entered
                //if password matched genrate token
                jwt.sign({username:username,password:password},'secretkey',(err,token)=>{
                    res.status(200).json({
                        token:token
                    });
                });
            }else{//show error
                res.status(403).json({
                    error:"Invalid user-id or password!"
                });
            }
        }else{
            res.status(403).json( {//show error
                error:"Invalid user-id or password!"
            });
        }
    });

});
function authentication(username,password){
    
}
module.exports = router;