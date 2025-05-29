const express = require('express');
const router = express.Router();
const {getToken} = require("../utils/artsyToken");

const formatting = (biography) => {
    if (!biography) return "";
    biography = biography.replace(/(\w+)-\s?(\w+)/g, '$1$2');
    const paras = biography.split('\n\n');
    const htmlpara = paras.map(para => `<p>${para.trim()}</p>`);
    return htmlpara.join('');
  };

router.get('/:artistid', async(req, res)=>{

    const token_value = await getToken();
    const base_url = `https://api.artsy.net/api/artists/${req.params.artistid}`;
    const header_details = {
        'Content-Type': 'application/json',
        'X-XAPP-Token': token_value
    }

    try {
        const response = await fetch(base_url,{
            method: 'GET',                          
            headers: header_details,
        });
        if(response.ok){
            let data= await response.json();
            let artistimg = '/artsy_logo.svg';
            if (data['_links']['thumbnail'] && data['_links']['thumbnail']['href']) {
                if(data['_links']['thumbnail']['href'] !== '/assets/shared/missing_image.png')
                    artistimg = data['_links']['thumbnail']['href'];
            }
            return res.status(200).json({ result:true, message: 
                {
                'artist_id': data['id'],
                'artist_img': artistimg,
                'artist_name' : data['name'],
                'artist_bday' : data['birthday'],
                'artist_dday' : data['deathday'],
                'artist_nationality' : data['nationality'],
                'artist_biography' : formatting(data['biography'])
                }
            })
        }
        else{
            return res.status(200).json({
                'message': await response.json(),
            })
        }

    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
})

router.get('/artists/:artistid', async(req, res)=>{

    const token_value = await getToken();
    const base_url = `https://api.artsy.net/api/artists?similar_to_artist_id=${req.params.artistid}`;
    const header_details = {
        'Content-Type': 'application/json',
        'X-XAPP-Token': token_value
    }

    try {
        const response = await fetch(base_url,{
            method: 'GET',                          
            headers: header_details,
        });
        if(response.ok){
            let data= await response.json();
            let artists = [];
            if(data['_embedded']['artists'].length==0)  return res.status(200).json({result:false, message: "similar artists not found"});
            else{
            for(let i=0; i<Math.min(data['_embedded']['artists'].length, 10); i++){
                let artist = data['_embedded']['artists'][i]
                let artist_info = {
                    'artist_ID': artist['id'],
                    'artist_Image': artist['_links']['thumbnail']['href'],
                    'artist_Title': artist['name']
                }
                if (artist_info['artist_Image'] == ('/assets/shared/missing_image.png' || undefined) )
                    artist_info['artist_Image'] = '/artsy_logo.svg'
                artists.push(artist_info);
            }
            return res.status(200).json({result:true, message: artists});
        }
        }
        else{
            return res.status(500).json({
                'message': await response.json(),
            })
        }

    } catch (error) {
        res.status(500).json({result:false, message: error.message});
    }
})

module.exports = router;