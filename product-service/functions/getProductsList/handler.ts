import { sql } from 'database';

export const getProductsList = async () => {
  console.log('new getProductsList request');
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  try {
    const products = await sql`
      SELECT id, title, description, price, count
      FROM product INNER JOIN stock ON id = product_id;
    `;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
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
