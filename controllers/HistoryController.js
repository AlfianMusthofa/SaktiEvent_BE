import prisma from "../lib/prisma.js";

export const getAllHistory = async (req, res) => {
   try {
      const response = await prisma.history.findMany();
      res.status(200).json(response)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const getHistoryByUser = async (req, res) => {
   const { userId } = Number(req.params.userId);

   try {
      const response = await prisma.history.findMany({
         where: {
            userId
         },
         include: {
            event: true
         }
      })
      res.status(200).json(response)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}