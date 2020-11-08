const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');


const RedisStore = connectRedis(session);

const redisClient = redis.createClient();

const redisStore = new RedisStore({client: redisClient})

module.exports = redisStore;