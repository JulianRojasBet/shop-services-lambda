import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";

export const basicAuthorizer = async (
  event: APIGatewayRequestAuthorizerEvent
) => {
  console.log("new basicAuthorizer request");

  try {
    const { headers } = event;
    const { authorization } = headers || {};

    if (!authorization) return { isAuthorized: false };

    const token = authorization.replace("Basic", "").trim();

    if (!token) return { isAuthorized: false };

    const buffer = Buffer.from(token, "base64");
    const [username, password] = buffer.toString("utf-8").split(":");

    if (!username || !password) return { isAuthorized: false };

    const isAuthorized = password === process.env[username];

    return { isAuthorized };
  } catch (error) {
    console.error(error);
    return { isAuthorized: false };
  }
};
