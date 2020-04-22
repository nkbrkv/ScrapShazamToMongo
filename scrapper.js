const request = require('request-promise')
const fs = require('fs');

const MongoClient = require("mongodb").MongoClient;
   
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

//each page in SHAZAM receives a response from the server in the form of a JSON file
const country = 'US';
const URL = `https://www.shazam.com/shazam/v3/en-US/UA/web/-/tracks/country-chart-${country}?pageSize=200&startFrom=0`;


const options = {
    method: 'GET',
    json: true,
    uri: URL
}

request(options)
    .then(function (response) {

        let data = response;
        data = data['tracks'];
        
        mongoClient.connect(function(err, client){
      
            const db = client.db(`shazamdb${country}`);
            const collection = db.collection(`topsongsin${country}`);
            

            for (var key in data) {

                collection.insertOne({id: key, artist: `${data[key]['subtitle']}`, song: `${data[key]['title']}`}, function(err, result){
                  
                    if(err){ 
                        return console.log(err);
                    }
                      
                });

            }
            console.log("Done!");
            client.close();
            
        });

    })
    .catch(function (err) {
        console.log('ERROR');
        throw err;
    })

