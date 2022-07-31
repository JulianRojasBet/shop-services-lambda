import aws from "aws-sdk";
import { BUCKET_NAME, UPLOAD_FOLDER_NAME } from "constants/index";

type Event = { queryStringParameters: { name: string } };

export const importProductsFile = async ({ queryStringParameters }: Event) => {
  const { name } = queryStringParameters;
  console.log("new importProductsFile request with:", name);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  // TODO: Check if name (required)

  const s3 = new aws.S3({ region: "us-east-1" });
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${UPLOAD_FOLDER_NAME}/${name}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({ signedUrl }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
