const cacheConfig = require('../config/cacheConfig.json');

var common = {

    // Gets the date and adds configured hours to the current time
    getTimeToLive: async () => {
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + cacheConfig.cacheTimeToLiveInHours)
        return currentDate;
    },

    // Projection to exclude columns
    getDatabaseProjection:  () => {
        let projection = {
            __v: false,
            _id: false,
            isDeleted: false
        };
        return projection;
    }
};

module.exports = common;