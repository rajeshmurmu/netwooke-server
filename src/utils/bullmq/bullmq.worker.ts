import config from "@src/config";
import logger from "@src/config/winston";
import { Post } from "@src/models";
import GenAIService from "@src/services/genai.service";
import { QueuePostData } from "@src/types";
import { Worker, Job } from "bullmq";

// default remove config to clean up completed and failed jobs
export const DEFAULT_REMOVE_CONFIG = {
  removeOnComplete: {
    age: 5000,
    count: 5,
  },
  removeOnFail: {
    age: 10000,
    count: 10,
  },
};

// default job config for retries and backoff
export const DEFAULT_JOB_CONFIG = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 1000,
  },
};

// process job
const processPost = async (job: Job<QueuePostData>) => {
  try {
    // logger.info(`Processing job ${job.id} for post ${job.data.postId}`);

    // process post data here
    const post = await Post.findById(job.data.postId);

    if (!post) {
      logger.error(`Post with id ${job.data.postId} not found`);
      throw new Error("Post not found");
    }

    // verify moderatenity of content
    const { isSafe, reason } = await GenAIService.moderateContent(
      post?.content,
    );

    if (!isSafe) {
      post.moderatenity.isSafe = false;
      post.moderatenity.reason = reason;
      await post.save();
      // logger.info(`Post ${job.data.postId} marked as unsafe: ${reason}`);
    } else {
      post.moderatenity.isSafe = true;
      await post.save();
      // logger.info(`Post ${job.data.postId} passed moderation`);
    }

    return { success: true, postId: job.data.postId };
  } catch (error) {
    logger.error(`Error processing post moderation job ${job.id}:`, error);
    throw error;
  }
};

export function startWorker() {
  try {
    // setup worker with proper config
    const MainWorker = new Worker("MainQueue", processPost, {
      connection: {
        host: config.REDIS_HOST || "localhost",
        port: config.REDIS_PORT || 6379,
        password: config.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      },
      ...DEFAULT_REMOVE_CONFIG,
      ...DEFAULT_JOB_CONFIG,
    });

    // worker listeners
    MainWorker.on("ready", () => {
      logger.info("BullMQ Worker is ready and listening for jobs...");
    });

    MainWorker.on("active", (job) => {
      logger.info(`Job ${job.id} is now active`);
    });

    MainWorker.on("completed", (job) => {
      logger.info(`Job ${job.id} completed successfully`);
    });

    MainWorker.on("failed", (job, err) => {
      logger.error(`Job ${job?.id} failed with error: ${err?.message}`);
    });

    MainWorker.on("error", (err) => {
      logger.error(`Worker error: ${err?.message}`, err);
    });

    return MainWorker;
  } catch (error) {
    logger.error("Failed to start worker:", error);
    throw error;
  }
}
