const { io, onlineUsers } = require("../socket.js");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const make = async (req, res) => {
  const userId = req.user.id;
  const { authorId, postId, content } = req.body;
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
          triggerBy: { connect: { id: userId } }, // ✅ correct relation name
          user: { connect: { id: authorId } }, // ✅ connect existing user
        },
      });

      const authorSocketId = onlineUsers.get(authorId);
      if (authorSocketId)
        io.to(authorSocketId).emit("receiveNotification", noti);
    }

    return res.json({ message: "comment created", comment });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { make };
