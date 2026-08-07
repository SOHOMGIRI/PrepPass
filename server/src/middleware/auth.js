import jwt from "jsonwebtoken";

const DEMO_GUEST_USER_ID = "650000000000000000000000";

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.userId = DEMO_GUEST_USER_ID;
    return next();
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.userId || DEMO_GUEST_USER_ID;
    next();
  } catch {
    req.userId = DEMO_GUEST_USER_ID;
    next();
  }
};
