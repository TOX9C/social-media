const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getFriends = async (req, res) => {
  const userId = req.user.id;
  try {
    const friends = await prisma.follow.findMany({
      where: {
        OR: [
          { followerId: userId, status: "ACCEPTED" },
          { followingId: userId, status: "ACCEPTED" },
        ],
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            pfpUrl: true,
          },
        },
        following: {
          select: {
            id: true,
            username: true,
            pfpUrl: true,
          },
        },
      },
    });

    const uniqueFriends = [];
    const seen = new Set();

    for (const friend of friends) {
      const pair = [friend.follower.id, friend.following.id].sort().join("-");
      if (!seen.has(pair)) {
        seen.add(pair);
        uniqueFriends.push(friend);
      }
    }

    const latestMessage = await Promise.all(
      uniqueFriends.map(async (friend) => {
        const message = await prisma.message.findFirst({
          orderBy: {
            created_at: "desc",
          },
          where: {
            OR: [
              { senderId: friend.followerId, receiverId: friend.followingId },
              { receiverId: friend.followerId, senderId: friend.followingId },
            ],
          },
        });

        let last = "none";
        if (!message) {
          last = "none";
        } else {
          last =
            message.senderId == userId
              ? "You"
              : friend.follower.id == userId
                ? friend.following.username
                : friend.follower.username;
        }

        const notUser =
          friend.follower.id == userId
            ? {
                id: friend.following.id,
                username: friend.following.username,
                pfpUrl: friend.following.pfpUrl,
              }
            : {
                id: friend.follower.id,
                username: friend.follower.username,
                pfpUrl: friend.follower.pfpUrl,
              };

        return { friend: notUser, message, last };
      }),
    );

    return res.json({ latestMessage });
  } catch (error) {
    console.log(error);
  }
};

const history = async (req, res) => {
  const userId = req.user.id;
  const { otherId } = req.body;
  try {
    const follow = await prisma.follow.findFirst({
      where: {
        OR: [
          {
            followerId: userId,
            followingId: otherId,
            status: "ACCEPTED",
          },
          {
            followerId: otherId,
            followingId: userId,
            status: "ACCEPTED",
          },
        ],
      },

      include: {
        follower: true,
      },
    });
    if (!follow) return res.json({ message: "not friends" });
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { receiverId: userId, senderId: otherId },
        ],
      },
    });
    return res.json({ messages });
  } catch (error) {
    console.log(error);
  }
};

const all = async (req, res) => {
  const userId = req.user.id;
  try {
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    });
    return res.json({ messages });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getFriends, history, all };
