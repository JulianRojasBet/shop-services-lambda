import { sql } from "database";

type Event = { body: string } ;

export const createProduct = async (event: Event) => {
  const buffer = Buffer.from(event.body, 'base64');
  const body = buffer.toString('ascii');
  const { title, description, price, count } = JSON.parse(body) || {};
  console.log('new createProduct request with:', JSON.parse(body));
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  if (!title || !description || !price || !count) {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad request' }),
    };
  }

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
  
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({ ...product, count: stock.count }),
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
