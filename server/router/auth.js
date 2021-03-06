const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcyrpt = require("bcryptjs");

require("../db/conn");
const User = require("../models/userSchema");

router.get("/", (req, res) => {
  res.send("Hello World!! shruti");
});

// Promises
// router.post("/register", (req, res) => {
//   const { name, email, phone, password, cpassword } = req.body;

//   if (!name || !email || !phone || !password || !cpassword) {
//     return res.status(422).json({ error: "Fill all the required field" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exists" });
//       }

//       const user = new User({ name, email, phone, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "User registered Successfully" });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => res.status(500).json({ message: "Failed to register" }));
// });

// Async-Await
router.post("/register", async(req, res) => {
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Fill all the required field" });
  }
try{
  const userExist = await User.findOne({ email: email })
  if (userExist) {
    return res.status(422).json({ error: "Email already exists" });
  }
  else if(password != cpassword){
    return res.status(422).json({ error: "Password didn't match..!!" });
  }
  else{
    const user = new User({ name, email, phone, password, cpassword });
   //yahe pe pre save function call karenge from userSchema for password

      await user.save()
         res.status(201).json({ message: "User registered Successfully" });   
    }
  }
    catch(err){
       res.status(500).json({ message: "Failed to register", err})
    }
  });

  //login route {POST Request}
  router.post('/signin',async(req, res) => {
    const{email, password} = req.body;
    try{
      if(!email || !password){
      return res.status(400).json({Error: "Please fill all the requird fields..!!"})
      }
   
    const userLogin = await User.findOne({email:email});
    //console.log(userLogin)
        if(userLogin) {
          const isMatch = await bcyrpt.compare(password, userLogin.password);

          //Calling generated token from userSchema
          const token = await userLogin.generateAuthToken();
          //console.log(token);

          // storing token in cookies
          res.cookie('jwtoken', token,
          { expires: new Date(Date.now() + 25892000000),
            httpOnly:true
          });

          if(!isMatch){
            res.status(400).json({Error:"Invalid Credentials..!!"})
          }
          else{
            res.status(200).json({message: "User Signin scucessfull..!!"})
          }     
        }
        else{
          res.status(400).json({Error:"Invalid Credentials..!!"})
        }

    }
        catch(err){
      console.log(err);
    }
  
   
  })









// router.get("/about", (req, res) => {
//   res.send("Welcome to about page");
// });

// router.get("/contact", (req, res) => {
//   res.send("Welcome to contact page");
// });

// router.get("/login", (req, res) => {
//   res.send("Welcome to login page");
// });

// router.get("/register", (req, res) => {
//   res.send("Welcome to register page");
// });

module.exports = router;
