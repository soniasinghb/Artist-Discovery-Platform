const express = require('express');
const router = express.Router();
const {getToken} = require("../utils/artsyToken");

router.get('/', async(req, res)=>{
    const artist_name = req.query.name;
    const token_value = await getToken();
    const payload = new URLSearchParams({
        q: artist_name,
        size: 10,
        type: "artist"
      });
    const base_url = `https://api.artsy.net/api/search?${payload}`;
    const header_details = {
        'Content-Type': 'application/json',
        'X-XAPP-Token': token_value
    }

    try {
        const response = await fetch(base_url,{
            method: 'GET',                          //get cannot have body so pass payload as query params
            headers: header_details,
        });
        if(response.ok){
            let data= await response.json();
            let artists = [];
            if(data['_embedded']['results'].length==0)  return res.status(200).json({result:false, message: "artists not found"});
            else{
            for(let i=0; i<Math.min(data['_embedded']['results'].length, 10); i++){
                let artist = data['_embedded']['results'][i]
                let artist_url = new URL(artist['_links']['self']['href']);
                let artist_parsed_url = artist_url.pathname.split('/');
                let artist_ID = artist_parsed_url[artist_parsed_url.length-1];
                let artist_info = {
                    'artist_ID': artist_ID,
                    'artist_Image': artist['_links']['thumbnail']['href'],
                    'artist_Title': artist['title']
                }
                if (artist_info['artist_Image'] == '/assets/shared/missing_image.png')
                    artist_info['artist_Image'] = '/artsy_logo.svg'
                artists.push(artist_info);
            }
            return res.status(200).json({result:true, message: artists});
        }
        }else{
            return res.status(200).json({
                result: false,
                'message': await response.json(),
            })
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;