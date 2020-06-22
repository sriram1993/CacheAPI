const cacheModel = require('../models/cacheModel');
const cacheRepository = require('../repository/cacheRepository');
var cacheRepo = new cacheRepository();

class cacheService {

    async createCache(cache) {
        try {
            let response = await cacheRepo.createCache(cache);
            return response;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    async getCacheByKey(key) {
        try {
            console.log('Get Cache by Key Service')
            let data = await cacheRepo.getCacheByKey(key);
            return data;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    async getAllCache() {
        try {
            console.log('Get All cache Service')
            let data = await cacheRepo.getAllCache();
            return data;
        }
        catch (err) {
            console.error(err);
            return err;
        }

    }

    async updateCache(cache) {
        try {
            let updatedData = await cacheRepo.updateCache(cache);
            return updatedData;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }

    // async deleteCacheById(cacheId){

    // }

    async deleteAllCache() {
        try {
            let response = await cacheRepo.deleteAllCache();
            return response;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }
}

module.exports = cacheService;