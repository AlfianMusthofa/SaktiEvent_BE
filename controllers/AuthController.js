import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export const login = async (req, res) => {

   const { name, password } = req.body;
   try {
      const user = await prisma.user.findFirst({
         where: {
            name: name
         }
      })

      if (!user) return res.status(404).json({ msg: "User not found!" })
      const matchedPassword = await bcrypt.compare(password, user.password)

      if (!matchedPassword) return res.status(400).json({ msg: "Username or Password is invalid!" })
      req.session.user = {
         id: user.id,
         username: user.name,
         email: user.email,
         phone: user.phone
      }

      res.status(200).json({
         msg: "Login success...", data: {
            id: user.id,
            username: user.name,
            email: user.email,
            phone: user.phone,
         }
      })

   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const logout = async (req, res) => {
   try {
      req.session.destroy((err) => {
         if (err) return res.status(500).send('Failed to logout');
         res.clearCookie("connect.sid");
         res.send("Logout success...")
      })
   } catch (error) {
      res.json({ msg: error.message })
   }
}