const { io, onlineUsers } = require("../socket.js");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const make = async (req, res) => {
  const userId = req.user.id;
  const { authorId, postId, content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "content required" });
  }

  if (!postId) {
    return res.status(400).json({ message: "post id required" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: userId,
        postId: postId,
      },
      include: {
        user: {
          select: {
            username: true,
            pfpUrl: true,
          },
        },
      },
    });

    if (userId != authorId) {
      const noti = await prisma.notification.create({
        data: {
          type: "COMMENT",
          commentId: comment.id,
          postId: postId,
          triggerBy: { connect: { id: userId } },
          user: { connect: { id: authorId } },
        },
      });

      const authorSocketId = onlineUsers.get(authorId);
      if (authorSocketId)
        io.to(authorSocketId).emit("receiveNotification", noti);
    }

    return res.json({ message: "comment created", comment });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = { make };
