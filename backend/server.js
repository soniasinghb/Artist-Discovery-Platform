require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// const Registration = require('./models/db.model.js')

// app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))   
app.use(express.json()) 
app.use(cors({origin: 'http://localhost:4200',credentials: true}));


  
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// app.get('/', (req,res)=>{
//     res.send("Hello from Doheny");
// }) 

const {getToken} = require("./utils/artsyToken");
(async()=>{
    try {
        const token = await getToken();
    } catch (error) {
        res.status(500).json("could not load token");
    }
})();

const searchRouter = require("./routes/searchArtists.js");
const artistDetailsRouter = require("./routes/artists.js");
const artworkRouter = require("./routes/artworks.js");
const categoriesRouter = require("./routes/genes.js");
const dbRouter = require("./routes/authRoutes.js");
const favoritesRouter = require("./routes/favArtists.js");

app.use('/auth', dbRouter);
app.use('/search', searchRouter);
app.use('/artists', artistDetailsRouter);
app.use('/artworks', artworkRouter);
app.use('/genes', categoriesRouter);
app.use('/favArtists', favoritesRouter);

//mongo connection
// app.listen(3000);
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to mongoDB")
})
.catch((err)=>{
    console.log("failed connect ot mongoDB", err)
})

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
  });