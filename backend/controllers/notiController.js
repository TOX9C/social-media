const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getNoti = async (req, res) => {
  const userId = req.user.id;
  try {
    const notis = await prisma.notification.findMany({
      orderBy: {
        created_at: "desc",
      },
      where: {
        userId: userId,
      },
      include: {
        triggerBy: {
          select: {
            username: true,
            pfpUrl: true,
          },
        },
      },
    });
    return res.json({ notis });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const deleteNoti = async (req, res) => {
  const userId = req.user.id;
  const { notiId } = req.body;

  if (!notiId) {
    return res.status(400).json({ message: "notification id required" });
  }

  try {
    await prisma.notification.delete({
      where: {
        id: notiId,
        userId: userId,
      },
    });
    return res.json({ message: "noti deleted" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = { getNoti, deleteNoti };
