const Cache = require('../models/cacheModel');
const cacheConfig = require('../config/cacheConfig.json');
var randomstring = require("randomstring");

"use strict"
module.exports = {

    // Wrote this code initially to Insert objects to DB
    // createCache : async (req,res) =>{
    //     console.log('Cache Create Method')
    //     let requestData = req.body;
    //     // Get Current Date Object
    //     let dt = new Date();
    //     // Set the Date to current time + time to live hours set in the config file
    //     dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours)
    //     let cacheModel = new Cache({
    //         key : randomstring.generate(cacheConfig.cacheKeyLength),
    //         value : randomstring.generate(cacheConfig.cacheValueLength),
    //         accessCount : 0,
    //         timeToLive : dt,
    //         isDeleted : false
    //     });
    //     cacheModel.save()
    //     .then( resp => res.status(201).json(resp))
    //     .catch(error => {
    //         console.error(error)
    //         res.status(500).json(error);
    //     });
    // },


    // Update a Cache based on Key
    updateCache : async (req,res) => {
        let key = req.params.key;
        let dt = new Date();
        dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours)

        Cache.findOneAndUpdate({ "key": key },
        {
         "value" : randomstring.generate(cacheConfig.cacheValueLength),
         "accessCount" : 0,
         "timeToLive" : dt
        }).exec()
        .then(resp => {
            res.status(200).json(resp);
        })
        .catch(err =>{
            console.error(err)
            res.status(500).json(err);
        })

    },


    // Get All Cache Keys
    getAllCacheKey : async(req,res) => {
        Cache.find({},'key').exec()
        .then(response => {
            console.log(response.length);
            res.status(200).json(response);
        })
        .catch(error =>{
            res.status(500).json(error);
            console.log(error)
        });
    },


    // Get a cache Data by Key
    getCacheByKey : async (req,res) =>{
        let key = req.params.key;

        // Excluding the MongoDb ObjectId with -_id
        var getCache = Cache.findOne({"key" : key}, '-_id').exec()
        
        getCache
        .then(response =>{
            // If the key is available 
            if(response!= null){
                console.log("Cache hit");

                let key = response.key;
                let accessCount = response.accessCount + 1;
                // Get Current Date Object
                let dt = new Date();
                // Set the Date to current time + time to live hours set in the config file
                dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours);
                Cache.findOneAndUpdate({'key' : key},{'accessCount' : accessCount , 'timeToLive' : dt}).exec()
                .then(r => {
                    console.log(r)
                    res.status(200).json(r);
                })
                .catch(err => {
                    res.status(500).json(err);
                    console.log(error)
                });
                
            }
            // If the key is not available
            else {
                console.log("Cache Miss");

                //Check if the cache count is reached 
                Cache.countDocuments({}).exec()
                .then( count => {
                    // If Cache Count is not reached , Insert new Data
                    if(count< cacheConfig.cacheThreshold){
                        let dt = new Date();
                        // Set the Date to current time + time to live hours set in the config file
                        dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours)
                        let cacheModel = new Cache({
                            key : key,
                            value : randomstring.generate(cacheConfig.cacheValueLength),
                            accessCount : 0,
                            timeToLive : dt,
                            isDeleted : false
                        });
                        cacheModel.save()
                        .then( resp => res.status(201).json(resp.value))
                        .catch(error => {
                            console.error(error)
                            res.status(500).json(error);
                        });
                    }
                    // If Cache threshold is reached, overwrite existing data
                    else{
                        // Sort the data by accessCount and TimeToLive
                        Cache.find({}).sort({'accessCount' : 1, 'timeToLive' : 1}).exec()
                        .then( sortedCache => {
                            // Once the data is sorted , pick the first one and update 
                            // More details of the approach is given in readme file 
                             // Get Current Date Object
                            let dt = new Date();
                            // Set the Date to current time + time to live hours set in the config file
                            dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours)
                            let updateObject = sortedCache[0];
                            Cache.findByIdAndUpdate({ "_id": updateObject._id },
                            {"key" : randomstring.generate(cacheConfig.cacheKeyLength),
                             "value" : randomstring.generate(cacheConfig.cacheValueLength),
                             "accessCount" : 0,
                             "timeToLive" : dt
                            }).exec()
                            .then(resp => {
                               // console.log(resp);
                               console.log("DOONE")
                                res.status(200).json(resp);
                            })
                            .catch(err =>{
                                console.error(err)
                                res.status(500).json(err);
                            })

                            
                        })
                        .catch(error => {
                            console.error(error)
                            res.status(500).json(error);
                        });
                    }
                })
            }

        })
        .catch(err => {return err});
    },


    // Remove all cache data
    removeAllkey : async (req,res) => {
        Cache.deleteMany({}).exec()
        .then(response => res.status(204).json("All cache Items Deleted!"))
        .catch(error => {
            res.status(500).json(error);
            console.log(error)
        });
    },


    // Remove an object based on object key
    removeKey : async(req,res) => {
        let key = req.params.key;
        Cache.findOneAndDelete({'key' : key}).exec()
        .then(response => res.status(200).json("Key Deleted"))
        .catch(error => {
            res.status(500).json(error);
            console.log(error)
        })
    },
} 
