import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'
// const prisma = new PrismaClient();
import prisma from '../lib/prisma.js'


// CREATE
export const AddReport = async (req, res) => {

   if (req.files === null) return res.status(400).json({ msg: 'No file uploaded' })
   const { title, body, image, author } = req.body;
   const file = req.files.file;
   const fileSize = file.data.length;
   const ext = path.extname(file.name);
   const fileName = file.md5 + ext;
   const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
   const allowedType = ['.png', '.jpg', '.jpeg'];

   if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid image' })
   if (fileSize > 5000000) return res.status(422).json({ mgs: 'Gambar terlalu besar!' })

   file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message })
      try {
         const response = await prisma.report.create({
            data: {
               title: title,
               body: body,
               author: author,
               image: fileName,
               url: url
            }
         })
         res.status(201).json({ msg: "Report has been created!", response })
      } catch (error) {
         res.status(500).json({ msg: error.message })
      }
   })

}

// READ
export const GetAllReports = async (req, res) => {
   const page = parseInt(req.query.page) || 0;
   const limit = parseInt(req.query.limit) || 10;
   const search = req.query.search_query || "";
   const offset = limit * page;

   const totalRows = await prisma.report.count({
      where: {
         OR: [
            {
               title: {
                  contains: search,
               }
            }
         ]
      }
   });

   const totalPage = Math.ceil(totalRows / limit);

   const result = await prisma.report.findMany({
      where: {
         OR: [
            {
               title: {
                  contains: search,
               }
            }
         ]
      },
      skip: offset,
      take: limit,
      orderBy: {
         id: 'desc'
      }
   })

   res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage
   })
}

// GET SINGLE REPORT
export const GetReportById = async (req, res) => {
   const { id } = req.params;
   try {
      const response = await prisma.report.findFirst({
         where: {
            id: Number(id)
         }
      })
      res.status(200).json(response)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

// UPDATE
export const UpdateReport = async (req, res) => {

   const { id } = req.params;
   const { title, body, image, author } = req.body;

   try {
      const response = await prisma.report.update({
         data: {
            title: title,
            body: body,
            author: author,
            image: image
         }, where: {
            id: Number(id)
         }
      })
      res.status(200).json({ msg: "Report has been updated!", response })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const DeleteReport = async (req, res) => {
   const { id } = req.params;
   try {
      const response = await prisma.report.delete({
         where: {
            id: Number(id)
         }
      })
      res.status(200).json({ msg: "Report has been deleted!", response })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}