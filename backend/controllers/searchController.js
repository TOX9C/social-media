const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getBoth = async (req, res) => {
  const { value } = req.body;
  try {
    const users = await prisma.user.findMany({
      take: 3,
      where: {
        username: {
          contains: value,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        id: true,
        pfpUrl: true,
      },
    });

    const posts = await prisma.post.findMany({
      take: 15,
      where: {
        content: {
          contains: value,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        user: {
          select: {
            username: true,
            pfpUrl: true,
          },
        },
      },
    });
    return res.json({ users, posts });
  } catch (error) {
    console.log(error);
  }
};

const users = async (req, res) => {
  const { value } = req.body;
  try {
    const users = await prisma.user.findMany({
      take: 5,
      where: {
        username: {
          contains: value,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        id: true,
        pfpUrl: true,
      },
    });
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const posts = async (req, res) => {
  const { value } = req.body;

  try {
    const posts = await prisma.post.findMany({
      take: 15,
      where: {
        content: {
          contains: value,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        user: {
          select: {
            username: true,
            pfpUrl: true,
          },
        },
      },
    });
    return res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

const searchUser = async (req, res) => {
  const userId = req.user.id;
  const { searchId } = req.body;
  if (searchId == userId) return res.json({ message: "you" });

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(searchId),
      },
      select: {
        pfpUrl: true,
        username: true,
        _count: {
          select: {
            followers: {
              where: {
                status: "ACCEPTED",
              },
            },
            following: {
              where: {
                status: "ACCEPTED",
              },
            },
          },
        },
      },
    });

    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: parseInt(searchId),
      },
      select: {
        status: true,
      },
    });

    return res.json({ user, isFollowing });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { searchUser, getBoth, users, posts };
