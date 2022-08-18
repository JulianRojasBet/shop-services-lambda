import Converter from "csvtojson";
import { S3Event } from "aws-lambda";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import {
  BUCKET_NAME,
  UPLOAD_FOLDER_NAME,
  PARSE_FOLDER_NAME,
} from "constants/index";

export const importFileParser = async ({ Records }: S3Event) => {
  console.log("new importFileParser request");
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  const s3 = new S3Client({ region: "us-east-1" });
  const sqs = new SQSClient({ region: "us-east-1" });

  try {
    await Promise.all(
      Records.map(async (record) => {
        const { key } = record.s3.object;
        const getParams = {
          Bucket: BUCKET_NAME,
          Key: key,
        };

        const getObjectCommand = new GetObjectCommand(getParams);
        const getObjectOutput = await s3.send(getObjectCommand);
        const stream = getObjectOutput.Body;
        const converter = Converter()
        converter
          .fromStream(stream)
          .on("data", async (chunk) => {
            const buffer = Buffer.from(chunk);
            const product = JSON.parse(buffer.toString());
            const params = {
              MessageBody: JSON.stringify(product),
              QueueUrl: `${process.env.SQS_URL}`,
            };
            const sendMessageCommandOutput = new SendMessageCommand(params);
            await sqs.send(sendMessageCommandOutput);
          });

        const copyParams = {
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${key}`,
          Key: key.replace(UPLOAD_FOLDER_NAME, PARSE_FOLDER_NAME),
        };
        const copyObjectOutput = new CopyObjectCommand(copyParams);
        await s3.send(copyObjectOutput);

        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: key,
        };
        const deleteObjectOutput = new DeleteObjectCommand(deleteParams);
        await s3.send(deleteObjectOutput);
      })
    );

    return {
      headers,
      statusCode: 200,
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
