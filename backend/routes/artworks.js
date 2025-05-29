const express = require('express');
const router = express.Router();
const {getToken} = require("../utils/artsyToken");

router.get('/:artistid', async(req, res)=>{
    
    const token_value = await getToken();
    const base_url="https://api.artsy.net/api/artworks"
    const payload = new URLSearchParams({
        artist_id: req.params.artistid,
        size: 10
    });

    try {
        const response = await fetch(`https://api.artsy.net/api/artworks?${payload}`, {
            method:'GET',
            headers: {        
                'Content-Type': 'application/json',
                'X-XAPP-Token': token_value
            }
        });
        if(response.ok){
            let data = await response.json();
            let artworks = [];
            if(data['_embedded']['artworks'].length==0)  return res.json({"artwork": "not found"});
            else{
            for(let i=0; i<Math.min(data['_embedded']['artworks'].length, 10); i++){
                let artwork = data['_embedded']['artworks'][i]
                let artwork_info = {
                    'artwork_id': artwork['id'],
                    'artwork_title' : artwork['title'],
                    'artwork_img' : artwork['_links']['thumbnail']['href'],
                    'artwork_date' : artwork['date'],
                }
                artworks.push(artwork_info);
            }
            return res.status(200).json({result:true, message:artworks});
            }
        }
        else{
            return res.status(500).json({
                result: true,
                'message': await response.json(),
            })
        }
    } catch (error) {
        res.status(500).json({result:true, message: error.message});
    }
});

module.exports=router;