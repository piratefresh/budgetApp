import { plaid } from "@/server/plaid";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.body.accessToken;
  const response = await plaid.transactionsGet({
    access_token: accessToken,
    start_date: "2019-01-01",
    end_date: "2023-02-22",
  });

  res.status(200).json(response.data);
}
