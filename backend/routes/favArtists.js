const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const Registration = require('../models/db.model');

const verifyJWTToken = (req, res, next) =>{
    try {
        const token_curr = req.cookies.token;
        if(!token_curr)
            return res.status(401).json({result:false, message: "Token does not exist"});

        const decoded = jwt.verify(token_curr, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
}

router.post('/addFav', verifyJWTToken, async(req, res)=>{
    try {
        const {artistId, artistName, artistBday, artistDday, artistNationality, artistImg, additionTime} = req.body;
        const user = await Registration.findById(req.user.id);
        if(user.favArtists.find(fav => fav.artistId === artistId)){
            return res.status(200).json({result:false, message: "already added"});
        }
        user.favArtists.push({artistId, artistName, artistBday, artistDday, artistNationality, artistImg, additionTime});
        await user.save();
        res.status(200).json({result:true, message: "Fav added"});
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
});

router.delete('/removeFav', verifyJWTToken, async(req, res)=>{
    try {
        const {artistId} = req.body;
        const user = await Registration.findByIdAndUpdate(
            req.user.id,
            {$pull: {favArtists: {artistId}}},
            {new: true}
        );
        if(!user){
            return res.status(401).json({result:false, message: "user does not exist"});
        }
        res.status(200).json({result:true, message:"Fav Removed"});
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
});

router.get('/showFavs', verifyJWTToken, async(req, res)=>{
    try {
        const userFavs = await Registration.findById(req.user.id).select("favArtists");
        if(!userFavs){
            res.status(401).json({result:false, message: "user not found"});
        }
        //u can add sort by time logic here n send
        userFavs.favArtists.sort((a,b)=>b.additionTime-a.additionTime);
        res.status(200).json({result:true, message:userFavs});
    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
});

module.exports = router;