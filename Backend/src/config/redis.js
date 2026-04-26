// Fallback In-Memory cache for Hackathons 
// (Prevents crashes if Redis is not installed or connection string is wrong)
const memoryStore = new Map();

const redis = {
  set: async (key, value, mode, seconds) => {
    memoryStore.set(key, value);
    if (mode === "EX" && seconds) {
      setTimeout(() => memoryStore.delete(key), seconds * 1000);
    }
    return "OK";
  },
  get: async (key) => {
    return memoryStore.get(key) || null;
  }
};

console.log("Using In-Memory Fallback for Token Blocklist (No real Redis server needed!).");

export default redis;
