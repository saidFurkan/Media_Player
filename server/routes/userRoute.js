require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.put('/authorization', authenticateToken, async(req, res) => {
    res.json({status:1});
})


router.put('/update', authenticateToken, async(req, res) => {

    try{
        let user = (await User.find({userName:req.body.userName}))[0];

        user.name = req.body.name;
        user.email = req.body.email;
        user.age = req.body.age;
        let salt = await bcrypt.genSalt();
        user.password = (await bcrypt.hash(req.body.password , salt)).toString();
        
        await user.save();

        res.json({"message":"Success update", status:1, user});
    }
    catch(err){
        res.json({"message":"Unsuccess update!!! ", status:-1});

    }
})


router.post('/profile', authenticateToken, async(req, res) => {
    try{
        const user = (await User.find({userName:req.body.userName}))[0];
        // delete user["password"];
        res.json({"user":{"name":user.name, "userName":user.userName, "age":user.age, "email":user.email}, status:1});
        //console.log("address : " + req.connection.remoteAddress);
    }catch(err){
        res.json({message:'Error : There is no user named ' + req.body.userName, status:-1});
    }
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader== undefined) return res.json({message:"token is not exist", status:0});

    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.json({message : "Error : invalid token", status : -1});
        if(user.userName === req.body.userName) return next();
        res.json({message:'Error : invalid token', status:-1});
    
    });
}


router.put('/resetPwd', async(req, res) => {
    try{
        var user = await User.find({userName:req.body.userName});
        user = user[0];

        if(user.name === req.body.name && user.email === req.body.email && user.age == req.body.age ){
            let salt = await bcrypt.genSalt();
            user.password = (await bcrypt.hash(req.body.password , salt)).toString();
            
            await user.save();

            res.json({"message":"Success reset password", status:1, user});
        }
        else{
            throw err;
        }
        
    }
    catch(err){
        res.json({"message":"Unsuccess reset password!!!, check the information you entered ", status:-1});
    }
    
})


router.post('/login', async(req,res) => {
    try{
        var user = await User.find({userName:req.body.userName});
        user = user[0];

        await bcrypt.compare(req.body.password , user.password, (err, result) => {
            if(!result) return err;
            else if(err) throw err;
            const accessToken = jwt.sign({userName: user.userName}, process.env.ACCESS_TOKEN_SECRET,  { expiresIn: '10m' });
            res.json({accessToken : accessToken, message : "User login successfully", status : 1});
        })

    }catch(err){
        res.json({message : "username or password wrong", status : -1});
    }
})


router.post('/register', async (req,res) => {

    var u = await User.find({userName:req.body.userName});
    if (u.length > 0){
        return res.json({message:"This user name are using.", status:-1});
    }    

    let salt = await bcrypt.genSalt();
    bcrypt.hash(req.body.password , salt, (err, hash)=>{
        if(err){
            return res.json({message : err, status : -1});
        }

        const user = new User({
            name : req.body.name,
            userName : req.body.userName,
            email : req.body.email,
            age : req.body.age,
            password : hash
        });

        try{
            user.save();
            res.json({message : "User added successfully", status : 1});
    
        }catch(err){
            res.json({message : "An error occured!", status : -1});
        }
        
    });
});





module.exports = router;