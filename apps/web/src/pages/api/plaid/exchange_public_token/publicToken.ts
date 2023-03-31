import { env } from "@/env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

if (!process.env.FINIMAL_TIER) {
  throw new Error("Unable to load Plaid tier");
}
if (!process.env[`PLAID_CLIENT_ID`]) {
  throw new Error("Unable to load Plaid client id");
}

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.FINIMAL_TIER.toLowerCase()],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

type Data = {
  access_token: string;
  item_id: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise((resolve, reject) => {
    client
      .itemPublicTokenExchange({
        public_token: req.query.publicToken as string,
      })
      .then((response) => {
        res.status(200).json({
          access_token: response.data.access_token,
          item_id: response.data.item_id,
        });
        // @ts-ignore
        resolve();
      })
      .catch((error) => {
        res.status(405).end(error);
        // @ts-ignore
        resolve();
      });
  });
}
