
const axios = require('axios');
const BASE_URL = "https://maps.googleapis.com";
const DEFAULT_RADIUS = "11000";
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
                `${BASE_URL}/maps/api/place/nearbysearch/json?location=${location}&radius=${DEFAULT_RADIUS}&keyword=Historic+place&pagetoken=&key=${API_KEY}`,
                `${BASE_URL}/maps/api/place/nearbysearch/json?location=${location}&radius=${DEFAULT_RADIUS}&keyword=Historic+landmark&pagetoken=&key=${API_KEY}`,
                `${BASE_URL}/maps/api/place/nearbysearch/json?location=${location}&radius=${DEFAULT_RADIUS}&keyword=Historic+Park&pagetoken=&key=${API_KEY}`
            ]
        } else if (tokens !== undefined) {
            Urls = tokens.map((token)=>{
                return `${BASE_URL}/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${API_KEY}`;
            });
        }

        console.log(tokens);

        try {

            const mergeDedupe = (arr) => {
                return [...new Set([].concat(...arr))];
            }
            
            let requests = Urls.map((url)=>{
                return axios.get(url, config);
            });

            let getResults = await axios.all(requests);
            let tempResults = [];
            let tokens = [];
        

            for(let i=0;i<getResults.length;i++) {
                tempResults.push(getResults[i].data.results);
                tokens.push(getResults[i].data.next_page_token);
            }

            let yy = mergeDedupe(tempResults);
  
            res.status(200).json({
                "tokens": tokens,
                "results": getUnique(yy, 'place_id')
            });

        } catch (err) {
            res.status(500).send(err);
        }
    }  
}