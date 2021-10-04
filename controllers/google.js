
const axios = require('axios');
const { request } = require('express');
const BASE_URL = "https://maps.googleapis.com";
const DEFAULT_RADIUS = "10000";
const API_KEY = "AIzaSyCUNe0QGA_r9DRrcii0-usSz7MGBOZLmaM"

const config = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

module.exports = {
    getLandmarks: async (req, res)=>{
        const getUnique = (arr, comp) =>{
            // store the comparison  values in array
            const unique =  arr.map(e => e[comp])
    
                // store the indexes of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)
    
                // eliminate the false indexes & return unique objects
                .filter((e) => arr[e]).map(e => arr[e]);
    
            return unique;
        };
        
        const { location, isEnd,tokens} = req.query;
        let Urls;
        //console.log('-------------------------------------------------------------'+tokens+'--------------------------------------------------------------------------');
        if(isEnd === 'false'){
            Urls = [
                `${BASE_URL}/maps/api/place/nearbysearch/json?location=${location}&radius=${DEFAULT_RADIUS}&keyword=things+to+do&pagetoken=&key=${API_KEY}`
            ]
        } else if (tokens !== undefined) {
            Urls = tokens.map((token)=>{
                return `${BASE_URL}/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${API_KEY}`;
            });
        }

        try {

            let requests = Urls.map((url)=>{
                return axios.get(url, config);
            });
            
            let getResults = await axios.all(requests);

            let apiresults = getResults[0].data.results;

            for (let index = 0; index < apiresults.length; index++) {
                const element = apiresults[index];
                const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${element.photos[0].photo_reference}&key=${API_KEY}`
                apiresults[index]['thumbnail'] = imgUrl;
            }
            
            res.status(200).json({
                "tokens": getResults[0].data.tokens,
                "results": getUnique(apiresults, 'place_id')
            });


        } catch (err) {
            res.status(500).send(err);
        }
    }  
}