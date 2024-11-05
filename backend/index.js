const express = require('express');
const mongoose = require('mongoose');
// const Users = require('./models/users');
// const fs = require('fs');
const cors = require("cors");
// const bcrypt = require('bcrypt');
const Products = require('./models/product');
const { register, login } = require('./controllers/userController');
const Todo = require('./models/todo');

let app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://abhishek708158:EcGUlZJYDvR8UoGd@myshop.uasaj.mongodb.net/?retryWrites=true&w=majority&appName=myShop')
  .then((res) => {
    console.log("database is successfully connected");
  })
  .catch((err) => {
    console.log("Database is not connected", err.message);
  });

  app.post('/register', register);
  app.post('/login',login);
  // app.get('/products', (req, res) => {
  //     fs.readFile('./Products/product.json','utf-8', (err, data) => {
  //         if (err) {
  //             console.error(err);
  //             return res.status(400).json({ status: "Failed", msg: "error data not found" });
  //         }
  //         console.log(JSON.parse(data));
  //         res.json(JSON.parse(data));
  //     });
  // });

  app.post('/add', (req, res) => {
    const { title, discPrice, realPrice, image, type } = req.body;

    if (!title || !discPrice || !realPrice || !image || !type) {
      return res.status(400).json({ status: "Failed", msg: "Please provide all required fields" });
    }

    const newProduct = new Products(req.body);

    newProduct.save()
      .then((response) => {
        res.status(201).json({ status: "Success", msg: "New product created successfully" });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).json({ status: "Failed", msg: "Validation error", errors: err.errors });
        } else {
          res.status(500).json({ status: "Failed", msg: "Server error", error: err.message });
        }
      });
  });

  app.get('/data', (req, res) => {
    Products.find()
      .then((products) => res.json(products))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ status: "Failed", msg: "Error while fetching data" })
      })
  })


  app.post('/todo',(req,res)=>{
    const {text}= req.body;
    const newTodo =  new Todo({
      text
    })
    newTodo.save()
    .then(resp=>{
      res.send("success")
    })
    .catch(err=>{
      res.send('failed')
    })
  })

  // red
  app.get('/todo',(req,res)=>{
    // const {text}= req.body;
    // const newTodo =  new Todo({
    //   text
    // })
    Todo.find({})
    .then(resp=>{
      res.json({data:resp})
    })
    .catch(err=>{
      res.send('failed')
    })
  })

  // delete
  app.post('/todo/:id',(req,res)=>{
    const {id}= req.params;
    // const newTodo =  new Todo({
    //   text
    // })
    console.log(id);
    Todo.findByIdAndDelete({_id:id})
    .then(resp=>{
      res.send("success")
    })
    .catch(err=>{
      res.send('failed')
    })
  })

  // update

  app.post('/todo/:id',(req,res)=>{
    const {id}= req.params;
    const {text}=req.body;

    const newTodo =  new Todo({
      text
    })
    Todo.findByIdAndUpdate({_id:id},{$set, newTodo})
    .then(resp=>{
      res.send("success")
    })
    .catch(err=>{
      res.send('failed')
    })
  })
  
  app.listen(4000, () => {
    console.log("server is running on port 4000");
  })



