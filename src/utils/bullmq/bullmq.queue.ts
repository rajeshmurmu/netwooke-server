import config from "@src/config";
import logger from "@src/config/winston";
import { Queue } from "bullmq";
import { DEFAULT_JOB_CONFIG, DEFAULT_REMOVE_CONFIG } from "./bullmq.worker";
import { QueuePostData } from "@src/types";

const MainQueue = new Queue("MainQueue", {
  connection: {
    host: config.REDIS_HOST || "localhost",
    port: config.REDIS_PORT || 6379,
    password: config.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => Math.min(times * 50, 2000), // exponential backoff for connection retries
  },
  defaultJobOptions: {
    ...DEFAULT_JOB_CONFIG,
    ...DEFAULT_REMOVE_CONFIG,
  },
});

// Log queue events for debugging
MainQueue.on("error", (err) => {
  logger.error(`Queue error: ${err?.message}`);
});

// method to add post to queue
export async function addPostToQueue(data: QueuePostData) {
  // logger.info(`Adding post ${data.postId} to queue...`);
  try {
    const job = await MainQueue.add("processPost", data, DEFAULT_JOB_CONFIG);
    // logger.info(`Job ${job.id} added to queue for post ${data.postId}`);
    return job;
  } catch (error) {
    logger.error(`Failed to add job to queue: "`, error);
    throw error;
  }
}

export default MainQueue;
