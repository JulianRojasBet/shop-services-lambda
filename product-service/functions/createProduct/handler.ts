import { sql } from "database";
import { Product } from "types/Product";

type Event = { body: Product & { count: number } };

export const createProduct = async (event: Event) => {
  const { id, title, description, price, count } = event.body || {};
  console.log('new createProduct request with:', event.body);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  if (!id || !title || !description) {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad request' }),
    };
  }

  try {
    const [product, stock] = await sql.begin(async (sql) => {
      const [product] = await sql`
        INSERT INTO product (id, title, description, price)
        VALUES (${id}, ${title}, ${description}, ${price}) RETURNING *;
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
  } finally {
    sql.end();
  }
};
