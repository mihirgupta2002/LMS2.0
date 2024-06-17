const cors=require('cors');
const express= require('express');
const bodyParser=require('body-parser');

const server=express();
server.use(cors());
server.use(bodyParser.json());

const User= require("../index.js");


const getUsers=async (req,res)=>{
	try{
		const docs= await User.find({});
		res.status(200).json(docs);
		console.log(docs)
	}
	catch(e){
		res.status(500).json({message:e.message});
	}
}

module.exports={ getUsers}