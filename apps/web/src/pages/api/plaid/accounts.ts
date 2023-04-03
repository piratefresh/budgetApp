import { plaid } from "@/server/plaid";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accessToken = req.body.accessToken;
    const accountsResponse = await plaid.accountsGet({
      access_token: accessToken,
    });

    res.status(200).json(accountsResponse.data);
  } catch (error) {
    return res.status(400).json(formatError(error.response));
  }
}

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};
