// const mongoose = require('mongoose');
const express = require('express');
const Users = require('../models/users');
const bcrypt = require('bcrypt');


const register= (req, res) => {
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
  }


  const login= (req, res) => {
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
  }

  module.exports={
    register,
    login
  }