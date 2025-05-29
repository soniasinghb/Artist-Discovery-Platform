const express = require('express');
const router = express.Router();
const Registration = require('../models/db.model.js')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const saltRounds = 10;
router.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;
const createJWTToken = (id) => jwt.sign(
    {id: id },
    JWT_SECRET,
    { expiresIn: '1h' }
);
const verifyJWTToken = (req, res, next) =>{
    try {
        const token_curr = req.cookies.token;
        if(!token_curr)
            return res.status(401).json({"message": "Token does not exist"});

        const decoded = jwt.verify(token_curr, JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//mongo login
router.post('/login', async(req, res)=>{
    const {emailid, password} = req.body;
    await Registration.findOne({emailid: emailid})
    .then(async user => {
        if(user){
            const matchPass = await bcrypt.compare(password, user.password);
            if(matchPass){
            const token = createJWTToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 60*60*1000  //1hr in ms
            });
            res.json({ result: true, message: "Success" });
            }else{
                res.status(200).json({ result: false, message: "Password or email is incorrect." });
            }
        }else{
            res.status(200).json({ result: false, message: "The given user is not registered" });
        }
    })
})

//actually i think this has to be done in frontend
const validateInput = (fullname, emailid, password) =>{
    if(!fullname || !emailid || !password){
        return "enter all fields";
    }
    const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    if(!emailCheckRegex.test(emailid)){
        return "enter in the form of xxx@yyy.zzz";
    }
    if(password.length<8) {
        return "password should be minimum of 8 characters";
    }
    return null;
}

//mongo 
router.post('/register', async(req,res)=>{
    try {
        const {emailid, password, fullname} = req.body;

        const hashedPasswd = await bcrypt.hash(password, saltRounds);

        const trimmedEmail = emailid.trim().toLowerCase();
        const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
        const profileImageUrl= `https://www.gravatar.com/avatar/${hash}?s=80&d=identicon`;

        const userExists = await Registration.findOne({emailid: emailid});
        if(userExists){
            return res.status(200).json({ result: false, message: "User with this email already exists."});
        }

        const user = await Registration.create({
            emailid: emailid,
            password: hashedPasswd,
            fullname: fullname,
            profileImageUrl: profileImageUrl
        });

        const token = createJWTToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60*60*1000  //1hr in ms
        });

        res.status(200).json({result: true, message: "user registered successfully"})
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
})

router.post('/logout', async(req, res)=>{
    res.clearCookie('token');
    res.status(200).json({result: true, message: "Logout successfully complete"});
});


router.delete('/deleteAccount', verifyJWTToken, async(req, res)=>{
    try {
        const deletedUser = await Registration.findByIdAndDelete(req.user.id);
        if(!deletedUser){
            return res.status(200).json({result:false, "error": "account does not exist"});
        }
        res.clearCookie('token');
        res.status(200).json({
        result: true,
        message: "Account deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
})

router.get('/me', verifyJWTToken, async(req, res)=>{
    try {
        const user = await Registration.findById(req.user.id).select('-password');
        if(!user){
            res.status(200).json({result:false, message: "Unauthenticated"});
        }
        res.status(200).json({result:true, message: user});
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
});

module.exports = router;