const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // console.log(authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No valid Bearer token found in the request header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "your-default-key");
    // console.log("verified token payload:", verified);

    const userId = verified.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found in the database");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Forbidden" });
  }
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-default-key", 
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  });
}

module.exports = { authMiddleware, authenticateToken };
