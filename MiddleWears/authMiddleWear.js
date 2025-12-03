export default function authMiddleware(req, res, next) {

  const header = req.headers.authorization;

  console.log("Authorization Header:", header);

  if (!header) {
    return res.status(401).json({
      success: false,
      message: "Missing Authorization header"
    });
  }

  const token = header.split(" ")[1];
  req.token = { token };
  next();
}