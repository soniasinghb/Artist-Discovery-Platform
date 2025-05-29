const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        fullname : {type: String, required: true},
        emailid : {
            type: String,
            required: [true, "Please enter email id"]
        },
        password: {type:String, required: true},
        profileImageUrl : {type: String},
        favArtists : [{
            artistId: {type:String, required:true},
            artistName: {type:String, required:true},
            artistBday: {type: Number},
            artistDday: {type: Number},
            artistNationality: {type: String},
            artistImg: {type: String},
            additionTime: {type: Date, default: Date.now}
        }]
    }
);

const Registration = mongoose.model("Registration", userSchema);
module.exports=Registration;