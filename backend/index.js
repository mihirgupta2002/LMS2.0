
// const userRoute = require("./test/test.user");
const bcrypt = require('bcrypt');

const cors=require('cors');
const express= require('express');
const bodyParser=require('body-parser')

// To connect with your mongoDB database
const mongoose = require('mongoose');

const server=express();
server.use(cors());
server.use(bodyParser.json());
//template for a table
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
});

const bookSchema= new mongoose.Schema({
	title: String,
	quantity:Number,
	isbn:Number,
	image:String,
	Status:String,
	description:String,
	authorName:String
})
const authorSchema= new mongoose.Schema({
	name:String,
    BookName:Array,

    image:String,
    description:String
})
const memberSchema= new mongoose.Schema({
	username:String,
   
    quantity:Number,
    password:String,
    address:String,
    totalBookBorrowed: Number,
    booksBorrowed:Array,
})
const requestSchema= new mongoose.Schema({
			title:String,
			quantity:Number,
            memberName:String,
		    Status:String
})

//create modal from schema 

const User= mongoose.model('User',userSchema);
//User acts as class to access data thorugh object
const Books= mongoose.model('Books',bookSchema);
const Members= mongoose.model('Members',memberSchema);
const Authors= mongoose.model('Authors',authorSchema);
const Requests= mongoose.model('Requests',requestSchema);



//request

server.get('/ViewRequest',async(req,res)=>{
	try {
		const [requests,members]=await  Promise.all([
		  Requests.find({}),
		   Members.find({})
		]) 

		res.status(200).json({requests: requests, members:members});
		
	} catch (error) {
		res.status(500).json({message:error.message})
		
	}
})
server.post('/ViewRequest',async(req,res)=>{
	try {
		const request= await Requests.create(req.body);
		const docs=await request.save();
		res.status(200).json(docs);
		
	} catch (error) {
		res.status(500).json({message:error.message})
		
	}
})
server.delete('/ViewRequest/:id',async(req,res)=>{
	try {
		const {id}= req.params;
		const request= await Requests.findByIdAndDelete(id);
		res.status(200).json(request);
		
	} catch (error) {
		res.status(500).json({message:error.message})
		
	}
})







//books


server.get('/book', async (req, res) => {
    try {
        // Execute both queries in parallel
        const [books, members,authors] = await Promise.all([
            Books.find({}),
            Members.find({}),
			Authors.find({})
        ]);

        // Combine results into a single object for response
        res.status(200).json({
            books: books,
            members: members,
			authors: authors
        });

        // Log the books data (you can also log members if needed)
        console.log(books,members,authors);
    } catch (e) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: e.message });
    }
});
server.get('/View/:id',async(req,res)=>{
	try{
		console.log("hitt.....")
		const {id}= req.params;
		
		const [books,authors]= await Promise.all([
			Books.findById(id),
			Authors.find({})
		]) 
		res.status(200).json({
            books: books,
            authors: authors
        });
		
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

// server.get('/book',async(req,res)=>{
// 	try{
// 		const books=  await Books.find({});
// 		 res.json(books)
// 		 console.log(books);
		 
// 	}
// 	catch(e){
// 		res.status(500).json({message:e.message})
// 	}
// })

server.get('/admin',async(req,res)=>{
	try{
		
		const [books,authors]= await Promise.all([Books.find({}),
			Authors.find({})
		]) 
		res.status(200).json({
			books:books,
			authors:authors
		});
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})
server.get('/viewMember/:id',async(req,res)=>{
	try{
		const {id}= req.params;
		const books= await Members.findById(id);
		res.status(200).json(books);
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})
server.get('/author/:id',async(req,res)=>{
	try{
		const {id}= req.params;
		const books= await Authors.findById(id);
		res.status(200).json(books);
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})
server.get('/MainEdit/:id',async(req,res)=>{
	try{
		const {id}= req.params;
		
		const [books,authors]= await Promise.all([
			Books.findById(id),
			Authors.find({})
		]) 
		res.status(200).json({
            books: books,
            authors: authors
        });
		
		console.log(books)
		console.log(authors)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})
server.get('/MainEditAuthor/:id',async(req,res)=>{
	try{
		const {id}= req.params;
		
		const books= await Authors.findById(id);
		res.status(200).json(books);
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})




server.delete('/admin/:id',async(req,res)=>{
	console.log(req.params.id)
	try{
		console.log("req.params", req.params)
		const {id}= req.params;
		const { idx, title }= req.body;
		const book= await Books.findByIdAndDelete(id);
		console.log("authorId",idx)
		
		const updatedAuthor = await Authors.findByIdAndUpdate(
			idx,
			{ $pull: { BookName: title } }, // Adds newBook to the booksBorrowed array
			{ new: true } //BReturn the updated document
		  );
		res.status(200).json(book);

		console.log(book)
		
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

server.post('/edit/:id',async(req,res)=>{
	try {
		const{id}= req.params;
		const{title}= req.body;
		const book= await Books.create(req.body)
		
		const doc= await book.save();
		console.log(title)
		console.log(doc);
		console.log(id)
		if(id!=='0'){
			await Authors.findByIdAndUpdate(
			id,
			{ $push: { BookName: title } }, // Adds newBook to the booksBorrowed array
			{ new: true } //BReturn the updated document
		  );
		}
		res.status(200).json(doc);
	} catch (error) {
		res.status(500).json({message: e.message})
		
	}
})

//user
server.put('/ViewRequest/:id', async(req,res)=>{
	try {
		console.log("api hit")
		const { id }= req.params;
		const {title,Status, memberIdx,totalBookBorrowed}=req.body;
		console.log(title,Status,User,totalBookBorrowed)
		const request= await Requests.findByIdAndUpdate(id,{Status} );

		const memberUpdate = await Members.findByIdAndUpdate(
            memberIdx,
            {
                $set: { "booksBorrowed.$[elem].Status": Status }
            },
            {
                arrayFilters: [{ "elem.title": title }], // Only update the book with the matching title
                new: true // Return the updated document
            }
        );
		console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
		const booksInc= await Members.findByIdAndUpdate(memberIdx,{totalBookBorrowed})
		res.status(200).json(booksInc);
		console.log(request);
		if(Status==='Rejected'){
			
			await Books.updateOne({title:title},{$inc:{quantity:+1}})
		}
		await Requests.deleteOne({title:title})

		
	} catch (error) {
		
		res.status(500).json({message:error.message})
	}
})
server.post('/userCard/:id',async(req,res)=>{
	try {
		const {id}=req.params
		const {title,image,Status,isbn,memberName,quantity,idx}= req.body;
		
	
		const request= await Requests.create({title,image,Status,memberName,quantity});
		const docs= await request.save();
		await Books.updateOne({ _id: idx }, { $inc: { quantity: -1 } });

		const memberRequest= await Members.findByIdAndUpdate(id,{$push :{booksBorrowed:{ title,image,Status,isbn,quantity }}})
		res.status(200).json(memberRequest);
		console.log(memberRequest)
		console.log(docs);
		
	} catch (error) {

		res.status(500).json({message:e.message})
	}
})
server.delete('/userrequest/:id',async(req,res)=>{
	try {
		const{id}= req.params;
		const{title,quantity}= req.body;
		console.log("title",title);
		const requ= await Members.findByIdAndUpdate(id,
			{ $pull: { booksBorrowed: { title } } }, // Remove the book with the matching title
            { new: true } 
		)
		// const bookUpdate= await Books.updateOne({title:title},{quantity:quantity})
		res.status(200).json(requ);
		
	} catch (error) {
		res.status(500).json({message:e.message})
	}
})
server.put('/userrequest/:id',async(req,res)=>{
	try {
		const{id}= req.params;
		const{title,quantity,totalBookBorrowed}= req.body;
		console.log("title",title);
		const Status="Returned";
		await Members.findByIdAndUpdate(id,{totalBookBorrowed});
		const bookUpdate= await Books.updateOne({title:title},{quantity:quantity})
		const memberUpdate = await Members.findByIdAndUpdate(
            id,
            {
                $set: { "booksBorrowed.$[elem].Status": Status }
            },
            {
                arrayFilters: [{ "elem.title": title }], // Only update the book with the matching title
                new: true // Return the updated document
            }
        );
		await Members.findByIdAndUpdate(id,{$pull:{booksBorrowed:{title}}},{new:true})
		res.status(200).json(memberUpdate);
		
	} catch (error) {
		res.status(500).json({message:e.message})
	}
})

server.put('/MainEdit/:id', async(req,res)=>{
	try {
		console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
		const { id }= req.params;
		
		const{oldidx,idx,title,quantity,isbn,Status,description,authorName,image,oldBook}=req.body;
		console.log("updating book",idx,title,quantity,isbn,Status,description,authorName,image)
		const book= await Books.findByIdAndUpdate(id, {title,quantity,isbn,Status,description,authorName,image},{ new: true }  );
		console.log(idx,"idx");
		console.log("boo",book);

		if(idx!=='-1'){
			console.log("idx is not -1", idx);
			
			if( oldidx!==-1){
				console.log('not -1 oldidx',oldidx)
				const authorAfterRemove = await Authors.findByIdAndUpdate(
				oldidx,
				{ $pull: { BookName: oldBook } }, // Remove oldBook from BookName array
				{ new: true } // Return the updated document
			  );
			 console.log("After removing old book:", authorAfterRemove);
			
			  // Then, add the new book title to the author's BookName array
			  console.log("title to be added",title);
			  const authorAfterAdd = await Authors.findByIdAndUpdate(
				idx,
				{ $push: { BookName: title } }, // Add the new book title to BookName array
				{ new: true } // Return the updated document
			  );
					console.log("After adding new book:", authorAfterAdd);
				console.log("authorUpdata")
				}
		else{
			console.log("idx is not -1", oldidx);
			 // Then, add the new book title to the author's BookName array
			 console.log("title to be added",title);
			 const authorAfterAdd = await Authors.findByIdAndUpdate(
			   idx,
			   { $push: { BookName: title } }, // Add the new book title to BookName array
			   { new: true } // Return the updated document
			 );
			 console.log("After adding new book:", authorAfterAdd);
		 console.log("authorUpdata")
		}
	}
		
		
		res.status(200).json(book);
		

		
	} catch (error) {
		
		res.status(500).json({message:error.message})
	}
})

//author
server.post('/MainEditAuthor/:id', async(req,res)=>{
	try {
		const { id }= req.params;
		const{name,oldName,description,image}=req.body;
		const bookUpdateManu= await Books.updateMany({authorName:oldName},{authorName:name})
		const book= await Authors.findByIdAndUpdate(id, {name,description,image});
		res.status(200).json(book);
		console.log(bookUpdateManu);

		
	} catch (error) {
		
		res.status(500).json({message:error.message})
	}
})
server.get('/Authorlist',async(req,res)=>{
	try{
		const author=  await Authors.find({});
		 res.status(200).json(author)
		 console.log(author);
		 
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

server.post('/EditAuthor',async(req,res)=>{
	try {
		const author= await Authors.create(req.body);
		const docs= await author.save();
		res.status(200).json(docs);
		console.log(docs);
		
	} catch (error) {

		res.status(500).json({message:e.message})
	}
})

// server.delete('/Authorlist/:id',async(req,res)=>{
// 	try {
// 		const {id}= req.params;
// 	    const author= await Authors.findByIdAndDelete(id);
// 	    res.status(200).json(author);
// 	} catch (error) {

// 		res.status(500).json({message:e.message})
// 	}
	
// })
server.delete('/Authorlist/:id',async(req,res)=>{
	console.log(req.params.id)
	try{
		console.log("req.params", req.params)
		const {id}= req.params;
		const{nameAuthor}=req.body;
		console.log("nameauthor",nameAuthor);
		const author= await Authors.findByIdAndDelete(id);
		
		const book = await Books.updateMany(
			{ authorName: nameAuthor},{ authorName:"" },
			
		  );
		res.status(200).json(book);

		console.log(author)
		
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

server.get('/MainEditAuthor/:id',async(req,res)=>{
	try{
		const {id}= req.params;
		
		const books= await Authors.findById(id);
		res.status(200).json(books);
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

//member
server.get('/MainEditMember/:id',async(req,res)=>{
	try{
		const {id}= req.params;
		
		const books= await Members.findById(id);
		res.status(200).json(books);
		console.log(books)
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

server.put('/MainEditMember/:id', async(req,res)=>{
	try {
		const { id }= req.params;
		const book= await Members.findByIdAndUpdate(id, req.body);
		res.status(200).json(book);
		console.log(book);

		
	} catch (error) {
		
		res.status(500).json({message:error.message})
	}
})



server.get('/Memberlist',async(req,res)=>{
	try{
		const books=  await Members.find({});
		res.status(200).json(books);
		 console.log(books);
		 
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

server.post('/EditMember', async(req,res)=>{
	try {
		const member= await Members.create(req.body);
		const doc= await member.save();
		console.log(doc);
		res.status(200).json(doc);
		
	} catch (error) {
		res.status(500).json({message:e.message})
		
	}
})

server.delete('/Memberlist/:id',async(req,res)=>{
	try {
		const {id}= req.params;
		const member= await Members.findByIdAndDelete(id);
		res.status(200).json(member);
		console.log(member);
		
	} catch (error) {
		res.status(500).json({message:e.message})
		
	}
})








server.get('/MainEdit/:id',async(req,res)=>{
	try {
		const author= await Authors.find({});
		res.status(200).json(author);
		
	} catch (error) {
		res.status(500).json({message:error.message})
		
	}
})


server.post('/book',async (req,res)=>{
	//req comes from frontend
	//res goes from database to frontend
	
	//create obj of class
	try{
		console.log('book post')
		console.log(req.body)
		const { username , password ,totalBookBorrowed,booksBorrowed} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user= await Members.create({username , password: hashedPassword,totalBookBorrowed,booksBorrowed});
		const doc= await user.save();
		console.log(doc)
		res.status(200).json(doc);
	}
	catch(error){
		res.status(500).json({message:error.message})

	}
	
	// let user= new User();
	// user.username= req.body.username;
	// user.password= req.body.password;
})
// server.use("/demo",userRoute)

server.get('/demo', async (req,res)=>{
	try{
		const docs= await User.find({});
		res.status(200).json(docs);
		console.log(docs)
	}
	catch(e){
		res.status(500).json({message:e.message});
	}
})

server.get('/demo/:id', async (req,res)=>{
	try{
		const {id}= req.params;
		const docs= await User.findById(id);
		res.status(200).json(docs);
		console.log(docs)
	}
	catch(e){
		res.status(500).json({message:e.message});
	}
})


server.delete('/demo' ,async(req,res)=>{
	try{
		
		 await User.deleteMany({});
	}
	catch(e){
		console.log(e)

	}
	
})

server.delete('/demo/:id' ,async(req,res)=>{
	try{
		const {id}= req.params;
		const user=await User.findByIdAndDelete(id);
		res.status(200).json(user);
	}
	catch(e){
		console.log(e)

	}
	
})
server.put('/demo/:id',async(req,res)=>{
	try{
		const {id}=req.params;
		const user=await User.findByIdAndUpdate(id,req.body);
		res.status(200).json(user);
	}
	catch(e){
		res.status(500).json({message:e.message})
	}
})

//user
server.get('/userCard/:id', async (req, res) => {
    try {
        // Execute both queries in parallel
		const {id}= req.params;
        const [books, members,authors] = await Promise.all([
            Books.find({}),
            Members.findById(id),
			Authors.find({})
        ]);

        // Combine results into a single object for response
        res.status(200).json({
            books: books,
            members: members,
			authors:authors
			
        });

        // Log the books data (you can also log members if needed)
        console.log(books,members);
    } catch (e) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: e.message });
    }
});
server.get('/userrequest/:id', async (req, res) => {
    try {
		console.log("api of userrequest")
        // Execute both queries in parallel
		const {id}= req.params;
		const [members,books]= await Promise.all([
			Members.findById(id),
			Books.find({})
		]) 
		res.status(200).json({
			members:members,
			books:books
		});
		

        // Combine results into a single object for response
        

        // Log the books data (you can also log members if needed)
       
    } catch (e) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: e.message });
    }
});


server.get('/edit',async(req,res)=>{
	try {
		const author= await Authors.find({});
	res.status(200).json(author);
	console.log(author)
	} catch (error) {
		res.status(500).json({ message: e.message });
		
	}
	

})

//login and signup








mongoose.connect('mongodb://127.0.0.1:27017/demo').then(()=>{
	console.log('dB connected');
	server.listen(8080,()=>{
	console.log('Server starteD');
})
})

