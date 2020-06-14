const mongoose = require('mongoose')

var Schema = mongoose.Schema;
let dt = new Date();

var Cache = new Schema(
    { 
        key : String,
        value : String,
        timeToLive : Date,
        accessCount : Number,
        isDeleted : Boolean
    }
);

const cacheSchema = mongoose.model('Cache', Cache);

module.exports = cacheSchema;