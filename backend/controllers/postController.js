const { PrismaClient } = require("../generated/prisma");
const { onlineUsers, io } = require("../socket.js");
const prisma = new PrismaClient();

const make = async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId: userId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        comments: {
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
            created_at: true,
            content: true,
            user: {
              select: {
                username: true,
                pfpUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return res.json({ message: "post created", post });
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(postId),
      },
      include: {
        user: {
          select: {
            username: true,
            pfpUrl: true,
          },
        },
        comments: {
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
            created_at: true,
            content: true,
            user: {
              select: {
                username: true,
                pfpUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return res.json({ post });
  } catch (error) {
    console.log(error);
  }
};

const get = async (req, res) => {
  try {
    console.log(onlineUsers);
    const posts = await prisma.post.findMany({
      take: 15,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            pfpUrl: true,
          },
        },
        comments: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return res.json({ posts });
  } catch (error) {
    console.log(error);
  }
};

const like = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;
  const like = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (like) {
    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });
    return res.json({ message: "unliked" });
  }

  try {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    return res.json({ message: "liked" });
  } catch (error) {
    console.log(error);
  }
};

const userPosts = async (req, res) => {
  const { userId } = req.body;
  const id = parseInt(userId);

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: { username: true, pfpUrl: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return res.json({ posts });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { userPosts, like, get, make, getPost };
