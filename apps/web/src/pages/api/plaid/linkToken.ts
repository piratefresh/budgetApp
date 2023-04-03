import { plaid } from "@/server/plaid";
import { NextApiRequest, NextApiResponse } from "next";
import util from "util";
import { Products } from "plaid";

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

const CONFIGS = {
  user: {
    // This should correspond to a unique id for the current user.
    client_user_id: "user-id",
  },
  client_name: "Plaid Quickstart",
  products: [Products.Transactions, Products.Auth],
  country_codes: PLAID_COUNTRY_CODES,
  language: "en",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const createTokenResponse = await plaid.linkTokenCreate(CONFIGS);
    prettyPrintResponse(createTokenResponse);
    res.json(createTokenResponse.data);
  } catch (err) {
    console.log("err: ", err);
  }
}

const prettyPrintResponse = (response: any) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};
