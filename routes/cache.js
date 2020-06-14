var express = require('express');
var router = express.Router();
var CacheController = require('../controller/cacheController');
const { route, put } = require('.');

// Route Configuration for Cache API's
router.route('/')
    // .post(CacheController.createCache)
    .delete(CacheController.removeAllkey)

router.route('/keys')
    .get(CacheController.getAllCacheKey)

router.route('/:key')
    .delete(CacheController.removeKey)
    .get(CacheController.getCacheByKey)
    .put(CacheController.updateCache)




module.exports = router;