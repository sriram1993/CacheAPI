const Cache = require('../models/cacheModel');
var common = require('../Utils/common');
var projection = common.getDatabaseProjection();

class cacheRepository {

    /**
     * 
     * @param {*} cacheObj - Cache Object to be store in database
     */
    async createCache(cacheObj) {
        try {
            let timeToLive = await common.getTimeToLive();

            // Get cache and check for duplicates
            let cacheArray = await this.getCacheByKey(cacheObj.key);
            console.log(cacheArray)
            if (cacheArray != null) {
                console.log("Duplicate");
                return 'ALREADY_EXISTS'
            }
            else {
                let cacheModel = new Cache({
                    key: cacheObj.key,
                    value: cacheObj.value,
                    accessCount: 0,
                    timeToLive: timeToLive,
                    isDeleted: false
                });
                await cacheModel.save();
                return 'CREATED';
            }
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
     * 
     * @param {*} key - Key to find in the cache
     */
    async getCacheByKey(key) {
        try {
            let cache = await Cache.findOne({ 'key': key }, projection).exec();
            return cache;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
     * Get All Cache from Database
     */
    async getAllCache() {
        try {
            let cache = await Cache.find({ "isDeleted": false }, projection).exec();
            return cache;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
     * 
     * @param {*} cacheObj - Update Cache based on Key
     */
    async updateCache(cacheObj) {
        try {
            let timeToLive = await common.getTimeToLive();
            let updatedCache = await Cache.findOneAndUpdate({ "key": cacheObj.key },
                {
                    "value": cacheObj.value,
                    "accessCount": 0,
                    "timeToLive": timeToLive
                }).exec();
            return updatedCache;
        }
        catch (err) {
            console.error(err)
            return err;
        }
    }

    async deleteCacheById(key) {
        try {
            let response = await Cache.findOneAndDelete({ 'key': key }).exec();
            return response;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    async deleteAllCache() {
        try {
            let response = await Cache.deleteMany({}).exec();
            return response;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }
}

module.exports = cacheRepository;