const express= require('express');


const router= express.Router();
const {getUsers} = require('./test.controller')

router.get('/', getUsers)

module.exports=router;