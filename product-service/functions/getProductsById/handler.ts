import { sql } from "database";

type Event = { pathParameters: { [k: string]: string } };

export const getProductsById = async (event: Event) => {
  const { productId } = event.pathParameters || {};
  console.log('new getProductsById request with:', productId);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  };

  try {
    const [product] = await sql`
      SELECT id, title, description, price, count 
      FROM product INNER JOIN stock ON id = product_id
      WHERE id = ${productId};
    `;

    if (!product) {
      return {
        headers,
        statusCode: 404,
        body: JSON.stringify({ error: "Product not found" }),
      };
    }

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({ ...product }),
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
