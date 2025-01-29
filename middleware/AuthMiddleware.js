import jwt from 'jsonwebtoken'

export const AuthMiddleware = (req, res, next) => {
   const token = req.cookies.token;

   if (!token) return res.status(401).json({ msg: "Unauthorized" });

   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Forbidden" });

      req.user = decoded;
      next();
   });
};

export default AuthMiddleware;
