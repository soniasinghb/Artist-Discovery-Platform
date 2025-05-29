const express = require('express');
const router = express.Router();
const {getToken} = require("../utils/artsyToken");

router.get('/:artworkid', async(req, res)=>{
    const token_value = await getToken();
    const base_url = "https://api.artsy.net/api/genes";
    const payload = new URLSearchParams({
        'artwork_id': req.params.artworkid,
    });

    try{
    const response = await fetch(`${base_url}?${payload}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-XAPP-Token': token_value
        }
    });
    if(response.ok){
        let dataset = await response.json();
        let categories = []; 
        if(dataset['_embedded']['genes'].length==0)  return res.json({"Categories": "not found"});
        for(let i=0; i<Math.min(10, dataset['_embedded']['genes'].length); i++){
            let data=dataset['_embedded']['genes'][i];
            let gene_info={
                'gene_name': data['name'],
                'gene_img': data['_links']['thumbnail']['href']
            }
            categories.push(gene_info);
        }
        return res.status(200).json({result:true, message:categories});
    }
    else{
        return res.status(500).json({
            result: false,
            'message': await response.json(),
        })
    }
}
    catch(error){
        res.status(500).json({result: false, message: error.message});
    }

});

module.exports=router;
// 515b0f9338ad2d78ca000554