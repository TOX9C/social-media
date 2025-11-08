const { io, onlineUsers } = require("../socket.js");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getRand = async (req, res) => {
  const userId = req.user.id;
  try {
    const users = await prisma.$queryRaw`
      SELECT id, username, "pfpUrl"
      FROM "User"
      WHERE id != ${userId}
        AND id NOT IN (
          SELECT "followingId" FROM "Follow" WHERE "followerId" = ${userId}
        )
      ORDER BY RANDOM()
      LIMIT 5;
    `;

    res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const getAll = async (req, res) => {
  const userId = req.user.id;
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true,
      },
    });

    return res.json({ following, followers });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const getRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const requests = await prisma.follow.findMany({
      where: {
        followingId: userId,
        status: "PENDING",
      },
    });

    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

const accept = async (req, res) => {
  const userId = req.user.id;
  const { followerId, followingId, id } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ message: "follower and following ids required" });
  }

  try {
    const request = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (!request || request.followingId !== userId)
      return res.status(403).json({ message: "not authorized" });

    await prisma.follow.update({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
      data: { status: "ACCEPTED" },
    });

    const notfi = await prisma.notification.create({
      data: {
        userId: followerId,
        triggerById: userId,
        type: "REQUEST_ACCEPT",
      },
    });

    await prisma.notification.delete({
      where: { id },
    });

    return res.json({ message: "request accepted" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const reject = async (req, res) => {
  const userId = req.user.id;
  const { followerId } = req.body;

  if (!followerId) {
    return res.status(400).json({ message: "follower id required" });
  }

  try {
    const request = await prisma.follow.findFirst({
      where: { followingId: userId, followerId },
    });
    if (!request || request.followingId !== userId)
      return res.status(403).json({ message: "not authorized" });

    await prisma.follow.update({
      where: { followerId_followingId: { followerId, followingId: userId } },
      data: { status: "REJECTED" },
    });

    const noti = await prisma.notification.create({
      data: {
        triggerById: request.followingId,
        userId: request.followerId,
        type: "REQUEST_REJECT",
      },
    });

    return res.json({ message: "request rejected" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const request = async (req, res) => {
  const { followingId } = req.body;

  if (!followingId) {
    return res.status(400).json({ message: "following id required" });
  }

  const fId = parseInt(followingId);
  const userId = req.user.id;
  const uId = parseInt(userId);
  
  try {
    const exsit = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: fId,
      },
    });

    if (exsit) return res.status(409).json({ message: "already requested" });

    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: fId,
      },
    });

    const noti = await prisma.notification.create({
      data: {
        triggerById: uId,
        userId: fId,
        type: "REQUEST_FOLLOW",
      },
    });

    const followingSocket = onlineUsers.get(fId);
    if (followingSocket)
      io.to(followingSocket).emit("receiveNotification", noti);

    return res.json({ message: "request sent" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = { getRand, getAll, getRequests, accept, reject, request };
