import config from "@src/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImageToCloudinary = async ({
  filePath,
  post_id,
}: {
  filePath: string;
  post_id: string;
}) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `netwooke/images/${post_id}`, // organize images by product ID
      use_filename: true,
      unique_filename: false,
      resource_type: "image",
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.log("upload_Image_To_Cloudinary::Error ", error);
  } finally {
    // remove image from local
    await fs.unlink(filePath);
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  try {
    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts.slice(-2).join("/").split(".")[0];
    const publicId = publicIdWithExtension; // includes folder structure

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.log("deleteImageFromCloudinary::Error ", error);
  }
};

export const deleteAllImageWithFolder = async ({
  post_id,
}: {
  post_id: string;
}) => {
  try {
    // 1. for deleting all images with the prefix (all images of a product) to empty the folder
    await cloudinary.api.delete_resources_by_prefix(
      `netwooke/images/${post_id}/`,
    );

    // 2. then delete the folder itself
    // for deleting the folder if needed (deletes all images in the folder)
    await cloudinary.api.delete_folder(`netwooke/images/${post_id}`);
  } catch (error) {
    console.log("delete_ImageFolder_From_Cloudinary:Error ", error);
  }
};

export const uploadAudioToCloudinary = async ({
  filePath,
  post_id,
}: {
  filePath: string;
  post_id: string;
}) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `netwooke/audios/${post_id}`, // organize audios by product ID
      use_filename: true,
      unique_filename: false,
      resource_type: "auto",
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.log("upload_Audio_To_Cloudinary::Error ", error);
  } finally {
    // remove audio from local
    await fs.unlink(filePath);
  }
};

export const deleteAudioFromCloudinary = async (audioUrl: string) => {
  try {
    const urlParts = audioUrl.split("/");
    const publicIdWithExtension = urlParts.slice(-2).join("/").split(".")[0];
    const publicId = publicIdWithExtension; // includes folder structure

    await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
  } catch (error) {
    console.log("deleteAudioFromCloudinary::Error ", error);
  }
};

export const deleteAllAudioWithFolder = async ({
  post_id,
}: {
  post_id: string;
}) => {
  try {
    // 1. for deleting all audios with the prefix (all audios of a product) to empty the folder
    await cloudinary.api.delete_resources_by_prefix(
      `netwooke/audios/${post_id}/`,
    );

    // 2. then delete the folder itself
    // for deleting the folder if needed (deletes all audios in the folder)
    await cloudinary.api.delete_folder(`netwooke/audios/${post_id}`);
  } catch (error) {
    console.log("delete_AudioFolder_From_Cloudinary:Error ", error);
  }
};

export const uploadVideoToCloudinary = async ({
  filePath,
  post_id,
}: {
  filePath: string;
  post_id: string;
}) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `netwooke/videos/${post_id}`, // organize videos by product ID
      use_filename: true,
      unique_filename: false,
      resource_type: "video",
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.log("upload_Video_To_Cloudinary::Error ", error);
  } finally {
    // remove video from local
    await fs.unlink(filePath);
  }
};

export const deleteVideoFromCloudinary = async (videoUrl: string) => {
  try {
    const urlParts = videoUrl.split("/");
    const publicIdWithExtension = urlParts.slice(-2).join("/").split(".")[0];
    const publicId = publicIdWithExtension; // includes folder structure

    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log("deleteVideoFromCloudinary::Error ", error);
  }
};

export const deleteAllVideoWithFolder = async ({
  post_id,
}: {
  post_id: string;
}) => {
  try {
    // 1. for deleting all videos with the prefix (all videos of a product) to empty the folder
    await cloudinary.api.delete_resources_by_prefix(
      `netwooke/videos/${post_id}/`,
    );

    // 2. then delete the folder itself
    // for deleting the folder if needed (deletes all videos in the folder)
    await cloudinary.api.delete_folder(`netwooke/videos/${post_id}`);
  } catch (error) {
    console.log("delete_VideoFolder_From_Cloudinary:Error ", error);
  }
};
