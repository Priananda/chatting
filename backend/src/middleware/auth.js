import jwt from "jsonwebtoken";

// Middleware untuk memverifikasi JWT
export const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];

  // Proses mengecek
  if (!header) {
    return res.status(401).json({ message: "Akses ditolak, header Authorization tidak ditemukan" });
  }

  // Verifikasi format bearer <token>
  const [bearer, token] = header.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Format token salah atau gunakan bearer <token>" });
  }

  try {
    // Verifikasi token dengan acuan env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Payload dari hasil jwt.verify 
    req.user = decoded;

    // Berlanjut ke controller lainnya
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token tidak valid atau kadaluwarsa",
      error: error.message,
    });
  }
};
