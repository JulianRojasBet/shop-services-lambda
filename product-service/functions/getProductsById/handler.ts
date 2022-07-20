import type { Product } from "types/Product";
import products from "mocks/products.json";

type Event = { pathParameters: { [k: string]: string } };

export const getProductsById = async (event: Event) => {
  const { productId } = event.pathParameters || {};
  const product = (products as unknown as Product[]).find(
    ({ id }: Product) => id === productId
  );

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  };

  await new Promise((resolve) => setTimeout(resolve, 500));

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
};
