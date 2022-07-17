import type { Product } from "types/Product";
import products from "mocks/products.json";

type Event = { pathParameters: { [k: string]: string } };

export const getProductsById = async (event: Event) => {
  const { productId } = event.pathParameters || {};
  const product = (products as unknown as Product[]).find(
    ({ id }: Product) => id === productId
  );

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Product not found" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ...product }),
  };
};
