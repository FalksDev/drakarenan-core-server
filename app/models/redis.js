require("dotenv").config();
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();
client.connect();

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on("error", (error) => {
    console.error(error);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const increment = promisify(client.incr).bind(client);
const setHash = promisify(client.hSet).bind(client);
const getHash = promisify(client.hGet).bind(client);

module.exports = {
    client,
    get,
    set,
    increment,
    setHash,
    getHash
};
