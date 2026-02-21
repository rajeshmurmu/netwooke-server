import Redis from "ioredis";
import logger from "./winston";
import config from ".";

class RedisClient {
  public static instance: Redis;
  public static isConnected: boolean = false;

  constructor() {}

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.REDIS_URL as string, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      RedisClient.setupEventListeners();
    }
    return RedisClient.instance;
  }

  static setupEventListeners() {
    RedisClient.instance.on("connect", () => {
      RedisClient.isConnected = true;
      logger.info("Connected to Redis");
    });

    RedisClient.instance.on("error", (error) => {
      RedisClient.isConnected = false;
      logger.error("Redis connection error:", error);
    });

    RedisClient.instance.on("close", () => {
      RedisClient.isConnected = false;
      logger.info("Redis connection closed");
    });

    RedisClient.instance.on("reconnecting", () => {
      logger.warn("Reconnection to Redis...");
    });

    RedisClient.instance.on("ready", () => {
      logger.warn("Redis client is ready");
    });

    RedisClient.instance.on("end", () => {
      RedisClient.isConnected = false;
      logger.info("Redis connection ended");
    });
  }

  static async disconnect() {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.quit();
        logger.info("Redis connection closed");
      } catch (error) {
        logger.error("Failed to disconnect from Redis:", error);
      }
    }
  }

  static isReady() {
    return RedisClient.isConnected;
  }

  static async testConnection() {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.ping();
        logger.info("Redis connection test successful");
        return true;
      } catch (error) {
        logger.error("Failed to test Redis connection:", error);
        return false;
      }
    }
    return false;
  }

  static async flushDB() {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.flushdb();
        logger.info("Redis database flushed");
      } catch (error) {
        logger.error("Failed to flush Redis database:", error);
      }
    }
  }
}

export const redisClient = RedisClient.getInstance();
export default RedisClient;
