var express = require('express');
var router = express.Router();
var CacheController = require('../controller/cacheController');


// Route Configuration for Cache API's
router.route('/')
    .delete(CacheController.removeAllkey)
    .get(CacheController.getAllCacheKey)
    .post(CacheController.createCache)
    .put(CacheController.updateCache)


router.route('/:key')
    .delete(CacheController.removeKey)


router.route('/search')
    .get(CacheController.getCacheByKey)




module.exports = router;