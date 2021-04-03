
const axios = require('axios');
const URL = "https://maps.googleapis.com/maps/api/place/details/json";
const API_KEY = "AIzaSyCUNe0QGA_r9DRrcii0-usSz7MGBOZLmaM"

const config = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

module.exports = {
    getLandmarkDetails: async (req, res)=>{
        
        const { place_id } = req.query;

        try {
            let getResults = await axios.get(`${URL}?place_id=${place_id}&key=${API_KEY}`, config);
            res.status(200).json(getResults.data);
        } catch (err) {
            res.status(500).send(err);
        }
    }  
}