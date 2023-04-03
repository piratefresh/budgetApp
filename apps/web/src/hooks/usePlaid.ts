import { cache } from "react";
import { useQuery } from "@tanstack/react-query";

export const fetchlinkToken = async (): Promise<{ linkToken: string }> => {
  const response = await fetch("/api/plaid/linkToken", {
    method: "POST",
  });
  const { link_token } = await response.json();

  return { linkToken: link_token };
};

export const usePlaidLinkToken = () => {
  return useQuery({
    queryKey: ["linkToken"],
    queryFn: () => fetchlinkToken(),
  });
};

export const fetchAccessToken = async ({
  publicToken,
}: {
  publicToken: string;
}): Promise<{ accessToken: string }> => {
  console.log("fetchAccessToken publicToken: ", publicToken);
  const response = await fetch("/api/plaid/exchangePublicToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicToken,
    }),
  });

  const { accessToken } = await response.json();

  return { accessToken };
};

export const usePlaidAccessToken = ({
  publicToken,
}: {
  publicToken: string | null;
}) => {
  console.log("publicToken: ", publicToken);
  return useQuery({
    queryKey: ["accessToken", publicToken],
    queryFn: () => fetchAccessToken({ publicToken: publicToken as string }),
    enabled: !!publicToken,
  });
};
