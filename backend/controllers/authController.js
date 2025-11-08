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
  
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(401).json({ message: "wrong username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "wrong password" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_CODE, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "username must be at least 3 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 characters" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(409).json({ message: "username not available" });
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
    return res.status(500).json({ message: "server error" });
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
  
  if (!file) {
    return res.status(400).json({ message: "no file uploaded" });
  }

  try {
    const fileName = `${userId}/${Date.now()}_${file.originalname}`;
    const { data: uploadData, error } = await supabase.storage
      .from("profile_picture")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
    
    if (error) {
      return res.status(500).json({ message: "failed to upload file" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.pfpUrl && user.pfpPath) {
      await supabase.storage
        .from("profile_picture")
        .remove([user.pfpPath]);
    }

    const { data } = supabase.storage
      .from("profile_picture")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        pfpUrl: publicUrl,
        pfpPath: fileName,
      },
    });

    return res.json({ publicUrl });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = { uploadpfp, login, register, getUser };
