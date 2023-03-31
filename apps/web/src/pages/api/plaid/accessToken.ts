import { getServerSession } from "next-auth";
import { authOptions } from "auth";
import { plaid } from "@/server/plaid";
import { prisma } from "db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    const publicToken = req.body.public_token;

    try {
      const response = await plaid.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const accessToken = response.data.access_token;
      const itemID = response.data.item_id;

      const addPlaidItem = await prisma.plaidItem.create({
        data: {
          accessToken: accessToken,
          itemId: itemID,
          user: { connect: { email: user?.email as string } },
        },
      });
      res.status(200).json({ message: "Added account" });
    } catch (error) {
      console.timeLog(error);
    }
  }
}
