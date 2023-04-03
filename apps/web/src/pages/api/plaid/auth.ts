import { plaid } from "@/server/plaid";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthGetRequest } from "plaid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accessToken = req.body.accessToken;
    console.log("accessToken", accessToken);

    const authResponse = await plaid.authGet({
      access_token: accessToken,
    } as AuthGetRequest);

    console.log("authResponse: ", authResponse);

    res.status(200).json(authResponse.data);
  } catch (error) {
    res.status(400).json({ error });
  }
}
