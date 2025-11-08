const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getBoth = async (req, res) => {
  const { value } = req.body;

  if (!value || value.trim().length === 0) {
    return res.status(400).json({ message: "search value required" });
  }

  try{
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
    return res.status(500).json({ message: "server error" });
  }
};

const users = async (req, res) => {
  const { value } = req.body;

  if (!value || value.trim().length === 0) {
    return res.status(400).json({ message: "search value required" });
  }

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
    return res.status(500).json({ message: "server error" });
  }
};

const posts = async (req, res) => {
  const { value } = req.body;

  if (!value || value.trim().length === 0) {
    return res.status(400).json({ message: "search value required" });
  }

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
    return res.status(500).json({ message: "server error" });
  }
};

const searchUser = async (req, res) => {
  const userId = req.user.id;
  const { searchId } = req.body;

  if (!searchId) {
    return res.status(400).json({ message: "search id required" });
  }

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
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = { searchUser, getBoth, users, posts };
