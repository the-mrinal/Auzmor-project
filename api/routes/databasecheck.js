const express = require('express');
const router = express.Router();

const db = require('../../db')

router.post('/',(req,res,next)=>{
    db.query("SELECT * from account", (err, resp) => {
        if (err) {
          return next(err)
        }
        res.json(resp.rows)
      })
});
module.exports = router;