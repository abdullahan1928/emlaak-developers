import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "emlaakdevelopers";

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (file: Buffer, id: string, index: number) => {
  const fileName = `project/${id}_${index}.jpg`; // Ensure file extension is correct
  const params: PutObjectCommandInput = {
    Bucket: AWS_BUCKET_NAME || "",
    Key: fileName,
    Body: file,
    ACL: "public-read",
  };

  try {
    const data = await s3.send(new PutObjectCommand(params));
    return {
      Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`,
    };
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export const getKeyFromUrl = (url: string) => {
  // Assuming the URL is something like: https://your-bucket-name.s3.amazonaws.com/projects/project_id_index.jpg
  const urlParts = url.split(`.com/`);
  if (urlParts.length > 1) {
    return urlParts[1];
  }
  return "";
};

// Utility function to delete an object from S3
export const deleteObjectFromS3 = async (key: string) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Error deleting object from S3", error);
    throw error;
  }
};
