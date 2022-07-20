import products from "mocks/products.json";

export const getProductsList = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: JSON.stringify([...products]),
  };
};
