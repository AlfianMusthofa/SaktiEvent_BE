import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export const login = async (req, res) => {

   const { username, password } = req.body;
   try {
      const user = await prisma.user.findFirst({
         where: {
            name: username
         }
      })

      if (!user) return res.status(400).json({ msg: "Username or Password is invalid!" })
      const matchedPassword = await bcrypt.compare(password, user.password)

      if (!matchedPassword) return res.status(400).json({ msg: "Username or Password is invalid!" })
      const token = jwt.sign({
         id: user.id,
         username: user.name,
         email: user.email,
         phone: user.phone
      }, process.env.SECRET_KEY,
         { expiresIn: '1d' })

      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         maxAge: 24 * 60 * 60 * 1000
      })

      res.status(200).json({
         msg: "Login success..."
      })

   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const logout = (req, res) => {
   res.clearCookie('token');
   res.status(200).json({ msg: "Logout success..." });
};
