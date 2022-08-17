import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SQSEvent } from "aws-lambda";

import { sql } from "database";
// force deploy
export const catalogBatchProcess = async ({ Records }: SQSEvent) => {
  console.log("new catalogBatchProcess request");
  console.log(Records)
  const sns = new SNSClient({ region: "us-east-1" });

  const productInserts = Records.map(async ({ body }) => {
    const { title, description, price, count }  = JSON.parse(body);
    console.log(title, description, price, count)

    if (!title || !description || !price || !count) return;

    try {
      const [product, stock] = await sql.begin(async (sql) => {
        const [product] = await sql`
          INSERT INTO product (title, description, price)
          VALUES (${title}, ${description}, ${price}) RETURNING *;
        `;
        const [stock] = await sql`
          INSERT INTO stock (product_id, count)
          VALUES (${product.id}, ${count}) RETURNING *;
        `;
        return [product, stock];
      });

      const params = {
        Message: `New product created: ${JSON.stringify(product)}\n with stock: ${JSON.stringify(stock)}`,
        TopicArn: `${process.env.SNS_TOPIC}`
      }
      const publichCommandOutput = new PublishCommand(params);
      await sns.send(publichCommandOutput);
    } catch (error) {
      console.error(error);
    }
  });

  await Promise.all(productInserts)
};
