const { PrismaClient } = require("../generated/prisma");
const { createClient } = require("@supabase/supabase-js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.json({ message: "wrong username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ message: "wrong password" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_CODE, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.json({ message: "username not available" });
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPass,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_CODE, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.json({ message: "token is missing" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_CODE);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        username: true,
        pfpUrl: true,
        id: true,
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
    return res.json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

const uploadpfp = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;
  if (!file) return console.log("no file");

  const fileName = `${userId}/${Date.now()}_${file.originalname}`;
  const { data: uploadData, error } = await supabase.storage
    .from("profile_picture")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (error) {
    console.log(error);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user.pfpUrl) {
    const { error } = await supabase.storage
      .from("profile_picture")
      .remove([user.pfpPath]);
  }

  const { data } = supabase.storage
    .from("profile_picture")
    .getPublicUrl(fileName);

  const publicUrl = data.publicUrl;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        pfpUrl: publicUrl,
        pfpPath: fileName,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return res.json({ publicUrl });
};

module.exports = { uploadpfp, login, register, getUser };
