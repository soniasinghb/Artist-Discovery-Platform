const dotenv = require('dotenv');
dotenv.config();

let cachedToken = {
    tokenVal: null,
    tokenExpiry: null
};

const getToken = async() => {
    const base_url = "https://api.artsy.net/api/tokens/xapp_token";
    const payload = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    };

    if(cachedToken.tokenVal && cachedToken.tokenExpiry > new Date()){
        // console.log("token available");
        return cachedToken.tokenVal;
    }
    try {
        const response = await fetch(base_url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if(!response.ok){
            throw new error("token cant be retrueved");
        }

        const data = await response.json();

        cachedToken.tokenVal = data.token;
        // console.log("new token fetched now")
        // console.log(cachedToken.tokenVal);
        cachedToken.tokenExpiry = new Date(data.expires_at);

        return cachedToken.tokenVal;
    } catch (error) {
        throw error(error);
    }
}



module.exports = { getToken };