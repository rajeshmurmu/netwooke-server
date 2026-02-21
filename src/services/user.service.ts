import config from "@src/config";
import { redisClient } from "@src/config/redis";
import { User } from "@src/models";
import { NotFoundError } from "@src/utils/error";

class UserService {
  constructor() {}

  static async getProfile(userId: string) {
    const storedUser = await redisClient.get(`user:${userId}`);

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.password = undefined;
    await redisClient.set(
      `user:${userId}`,
      JSON.stringify(user),
      "EX",
      config.REDIS_USER_TTL,
    );

    return user;
  }
}

export default UserService;
