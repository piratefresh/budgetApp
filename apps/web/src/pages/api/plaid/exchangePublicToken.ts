import { env } from "@/env.mjs";
import { authOptions } from "@/server/auth";
import { plaid } from "@/server/plaid";
import { User, prisma } from "db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

type Data = {
  accessToken: string;
  itemId: string;
  user: User;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const response = await plaid.itemPublicTokenExchange({
      public_token: req.body.publicToken as string,
    });

    const user = await prisma.user.update({
      where: {
        id: session?.user.id as string,
      },
      data: {
        PlaidItem: {
          create: {
            accessToken: response.data.access_token,
            itemId: response.data.item_id,
          },
        },
      },
    });

    res.status(200).json({
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
      user,
    });
  } catch (error) {
    res.status(405).end(error);
  }
}
