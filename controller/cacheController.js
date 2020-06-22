const Cache = require('../models/cacheModel');
const cacheConfig = require('../config/cacheConfig.json');
var randomstring = require("randomstring");
var common = require('../Utils/common')
var cacheService = require('../service/cacheService');
var cacheServiceInstance = new cacheService();

"use strict"
module.exports = {


    createCache: async (req, res) => {
        try {
            let requestData = req.body;
            let response = await cacheServiceInstance.createCache(requestData);
            // Adding switch case instead of if..else for function extensibility 
            switch (response) {
                case "ALREADY_EXISTS":
                    res.status(409).json('Duplicate key');
                    break;

                default:
                    res.status(200).json('Cache Created');
                    break;
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    },


    // Update a Cache based on Key
    updateCache: async (req, res) => {
        try {
            let requestData = req.body;
            let response = await cacheServiceInstance.updateCache(requestData);
            if(response != null )
                res.status(200).json('Cache Updated!!');
            else 
                res.status(404).json('Key does not exist!')
        }
        catch (err) {
            res.status(500).json(err);
        }
    },


    // Get All Cache Keys
    getAllCacheKey: async (req, res) => {
        try {
            let response = await cacheServiceInstance.getAllCache();
            res.status(200).json(response);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },


    // Get Cache by Key
    getCacheByKey: async (req, res) => {
        try {
            let key = req.query.key;
            let response = await cacheServiceInstance.getCacheByKey(key);
            if (response == null)
                res.status(204).json(response);
            else
                res.status(200).json(response);
        }
        catch (err) {
            console.log("Error" + err)
            res.status(500).json(err);
        }
    },

    // Get a cache Data by Key
    getCacheByKeyDuplicate: async (req, res) => {
        let key = req.params.key;

        // Excluding the MongoDb ObjectId with -_id
        var getCache = Cache.findOne({ "key": key }, '-_id').exec()

        getCache
            .then(response => {
                // If the key is available 
                if (response != null) {
                    console.log("Cache hit");

                    let key = response.key;
                    let accessCount = response.accessCount + 1;
                    // Get Current Date Object
                    let dt = new Date();
                    // Set the Date to current time + time to live hours set in the config file
                    dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours);
                    Cache.findOneAndUpdate({ 'key': key }, { 'accessCount': accessCount, 'timeToLive': dt }).exec()
                        .then(r => {
                            res.status(200).json(r);
                        })
                        .catch(err => {
                            res.status(500).json(err);
                        });

                }
                // If the key is not available
                else {
                    console.log("Cache Miss");

                    //Check if the cache count is reached 
                    Cache.countDocuments({}).exec()
                        .then(count => {
                            // If Cache Count is not reached , Insert new Data
                            if (count < cacheConfig.cacheThreshold) {
                                let dt = new Date();
                                // Set the Date to current time + time to live hours set in the config file
                                dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours)
                                let cacheModel = new Cache({
                                    key: key,
                                    value: randomstring.generate(cacheConfig.cacheValueLength),
                                    accessCount: 0,
                                    timeToLive: dt,
                                    isDeleted: false
                                });
                                cacheModel.save()
                                    .then(resp => res.status(201).json(resp.value))
                                    .catch(error => {
                                        res.status(500).json(error);
                                    });
                            }
                            // If Cache threshold is reached, overwrite existing data
                            else {
                                // Sort the data by accessCount and TimeToLive
                                Cache.find({}).sort({ 'accessCount': 1, 'timeToLive': 1 }).exec()
                                    .then(sortedCache => {
                                        // Once the data is sorted , pick the first one and update 
                                        // More details of the approach is given in readme file 
                                        // Get Current Date Object
                                        let dt = new Date();
                                        // Set the Date to current time + time to live hours set in the config file
                                        dt.setHours(dt.getHours() + cacheConfig.cacheTimeToLiveInHours)
                                        let updateObject = sortedCache[0];
                                        Cache.findByIdAndUpdate({ "_id": updateObject._id },
                                            {
                                                "key": randomstring.generate(cacheConfig.cacheKeyLength),
                                                "value": randomstring.generate(cacheConfig.cacheValueLength),
                                                "accessCount": 0,
                                                "timeToLive": dt
                                            }).exec()
                                            .then(resp => {
                                                res.status(200).json(resp);
                                            })
                                            .catch(err => {
                                                res.status(500).json(err);
                                            })


                                    })
                                    .catch(error => {
                                        res.status(500).json(error);
                                    });
                            }
                        })
                }

            })
            .catch(err => { return err });
    },


    // Remove all cache data
    removeAllkey: async (req, res) => {
        try {
            let response = await cacheServiceInstance.deleteAllCache();
            res.status(200).json(response);
        }
        catch (err) {
            console.log("Error" + err)
            res.status(500).json(err);
        }
    },


    // Remove an object based on object key
    removeKey: async (req, res) => {
        let key = req.params.key;
        Cache.findOneAndDelete({ 'key': key }).exec()
            .then(response => res.status(200).json("Key Deleted"))
            .catch(error => {
                res.status(500).json(error);
            })
    },
} 
