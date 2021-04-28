const router = require('express').Router();

router.route('/')
  .get((req,res)=>{
    res.status(200).json({
      mesage:"Hello World! Index"
    })
  })

module.exports = router;
