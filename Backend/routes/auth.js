const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../midleware/fetchuser");

const JWT_SECRET = process.env.SECRET_KEY;


//Route 1
// create a post request at "api/auth/createUser"  no login required
router.post("/createUser",[
    //express validation of email,name, password
    body("email", "Enter a valid name").isEmail(),
    body("name", "Enter a valid email").isLength({ min: 3 }),
    body("password", "Password must be at least 5 characters").isLength({min: 5,}),
  ],
  async (req, res) => {
    let success=false
    //if there are error return bad req to response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check whether the user with same email exists or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "Sorry the user with this email alredy exists" });
      }
      //create a new user
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt); //encrypted the password and added salt with it
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {id: user.id,},
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ success,authToken });

      //if other errors
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);


//Route 2
// login a user by POST request at "api/auth/loginUser"  no login required
router.post("/login",[
    //express validation of email,name, password
    body("email", "Enter a valid name").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false
    //if there are error return bad req to response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success,error:"Please try to login with correct credentials"})
      }
      //compairing password with the password store in DB
      const passComp = await bcrypt.compare(password,user.password);
      if(!passComp){
        return res.status(400).json({ success,error:"Please try to login with correct credentials"})
      }

      const data = {
        user: {id: user.id,},
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ success,authToken });

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal error occured");
    }
  }
);


//Route 3
//Get a user by POST request at "api/auth/getUser" login required
router.post("/getUser",fetchuser,async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findOne({userId}).select("-password")
      res.send(user)
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal error occured");
    }
});



module.exports = router;
