const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/users');
// const fs = require('fs');
const cors = require("cors");
const bcrypt = require('bcrypt');
const Products = require('./models/product')

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

  app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    Users.findOne({ email })
      .then(user => {
        if (user) {
          return res.status(404).json({ status: "Failed", msg: "User  already Exist try Login" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new Users({
          name,
          email,
          password: hashedPassword
        });
        newUser.save()
          .then((response) => {
            res.status(201).json({ status: "Success", msg: "new user Created Successful" });
          })
          .catch((err) => {
            res.status(500).json({ status: "Failed", msg: "server Error! user is not Created. " });
          });
      })
      .catch((err) => {
        res.status(500).json({ status: "Failed", msg: "server Error! user is not Created. " });
      });
  });
  app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    Users.findOne({ email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ status: "Failed", msg: "User  not found" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ status: "Failed", msg: "Invalid password" });
        }

        // If the password is valid, return success response
        res.status(200).json({ status: "Success", msg: "Login successful", user: { name: user.name, email: user.email } });
      })
      .catch(err => {
        res.status(500).json({ status: "Failed", msg: "Server Error!" });
      });
  });
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
  app.listen(4000, () => {
    console.log("server is running on port 4000");
  })