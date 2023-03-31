import React from "react";
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { usePlaid } from "../contexts/plaid/context";
import { usePlaidLinkToken } from "./usePlaidLinkToken";

export const usePlaidAccessTokenStore = () => {
  const { linkToken } = usePlaidLinkToken();
  const [state, dispatch] = usePlaid();

  const handleTokenExchange = React.useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      try {
        const response = await fetch(
          `/api/plaid/exchange_public_token/${public_token}`
        );
        const responseJson = await response.json();
        dispatch({
          type: "storeToken",
          payload: { token: responseJson.access_token },
        });
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  return {
    linkToken,
    handleTokenExchange,
    accessTokens: Array.from(state.accessTokens),
  };
};
