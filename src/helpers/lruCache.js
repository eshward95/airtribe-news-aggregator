const fs = require("fs");
const path = require("path");

const cacheFilePath = path.join(__dirname, "..", "..", "dev-db", "cache.json");
const maxCacheSize = 100;
const ttl = 30000; // in seconds

let cache = new Map();
let lru = [];

function readFromCache() {
  if (fs.existsSync(cacheFilePath)) {
    console.log("Cache file exists");
    const cacheData = fs.readFileSync(cacheFilePath, {
      encoding: "utf-8",
      flag: "r",
    });
    const cacheItems = cacheData && JSON.parse(cacheData);
    return cacheItems;
  }
  return null;
}

function writeToCache() {
  //We sort the cache and the add it to the hashmap
  const cacheItems = Array.from(cache.entries())
    .sort((a, b) => b[1].timestamp - a[1].timestamp)
    .slice(0, maxCacheSize)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  fs.writeFileSync(cacheFilePath, JSON.stringify(cacheItems));
  console.log("Cache file is updated");
}

function evictLRU() {
  const key = lru.shift();
  if (cache.has(key)) {
    cache.delete(key);
  }
}

function refreshLRU(key) {
  if (lru.includes(key)) {
    lru.splice(lru.indexOf(key), 1);
  }
  lru.push(key);
  if (lru.length > maxCacheSize) {
    evictLRU();
  }
}

function checkTTL(key) {
  const item = cache.get(key);
  if (item && (Date.now() - item.timestamp) / 1000 > ttl) {
    cache.delete(key);
    return true;
  }
  return false;
}

exports.getCacheItem = (key) => {
  if (checkTTL(key)) {
    console.log("Cache item has expired");
  }
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Data is cached");
    refreshLRU(key);
    return cachedData.data;
  }
  console.log("Data is not cached");
  return null;
};

exports.setCacheItem = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
  refreshLRU(key);
  writeToCache();
};

// initialize cache from cache file
const cacheItems = readFromCache();
if (cacheItems) {
  cache = new Map(Object.entries(cacheItems));
  lru = Object.keys(cacheItems);
  console.log("Cache is initialized from cache file");
}
