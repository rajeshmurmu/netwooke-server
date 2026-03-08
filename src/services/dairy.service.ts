import { Dairy } from "@src/models";

class DairyService {
  static async getDairyEnteries(userId: string) {
    // Logic to fetch dairy entries from the database
    const entries = await Dairy.find({ userId }).sort({ createdAt: -1 });
    return entries;
  }

  static async getPublicDairyEntries(userId: string) {
    // Logic to fetch public dairy entries from the database
    console.log("Fetching public dairy entries for userId:", userId);
    const entries = await Dairy.aggregate([
      { $match: { userId: { $ne: userId } } }, // // remove requested user entries
      { $match: { isPrivate: false } }, // Only public entries
      { $sort: { createdAt: -1 } }, // Sort by creation date (newest first)
      {
        $lookup: {
          from: "users", // The name of the users collection
          localField: "userId", // Field in Dairy that references User
          foreignField: "_id", // Field in User that is referenced
          as: "user", // Alias for the joined user data
        },
      },
      { $unwind: "$user" }, // Unwind the user array to get a single user object
      {
        $project: {
          title: 1,
          content: 1,
          isPrivate: 1,
          createdAt: 1,
          "user.name": 1,
          "user.avatar": 1,
        },
      },
      { $limit: 10 }, // Limit to the most recent 20 public entries
    ]);

    return entries;
  }

  static async createEntry(data: {
    title: string;
    content: string;
    isPrivate?: boolean;
    userId: string;
  }) {
    // Logic to create a new dairy entry in the database
    const dairy = await Dairy.create({
      userId: data.userId,
      title: data.title,
      content: data.content,
      isPrivate: data.isPrivate,
    });
    return dairy;
  }

  // Additional methods for retrieving, updating, and deleting entries can be added here
}

export default DairyService;
