import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient();
import prisma from '../lib/prisma.js';

// CREATE
export const AddEvent = async (req, res) => {

   const { name, place, link, status, image, descriptions, reasons, notes, date, time, details, speakerName, speakerImage, speakerPosition, speakerBiography } = req.body;

   try {
      const eventResponse = await prisma.event.create({
         data: {
            name: name,
            place: place,
            link: link,
            status: status,
            image: image,
            descriptions: descriptions,
            reasons: reasons,
            notes: notes,
            date: date,
            time: time,
            details: details
         }
      })

      const speakerResponse = await prisma.speaker.create({
         data: {
            speakerName: speakerName,
            speakerImage: speakerImage,
            speakerBiography: speakerBiography,
            speakerPosition: speakerPosition,
            Event: {
               connect: { id: eventResponse.id }
            }
         }
      })

      if (!eventResponse && !speakerResponse) {
         res.status(400).json({ msg: "Something wrong i can feel it!" })
      }

      res.status(200).json({
         msg: "Event has been created!",
         event: eventResponse,
         speaker: speakerResponse
      })

   } catch (error) {
      res.status(500).json({ msg: error.message })
   }

}

// READ
export const GetAllEvents = async (req, res) => {

   const page = parseInt(req.query.page) || 0;
   const limit = parseInt(req.query.limit) || 10;
   const search = req.query.search_query || "";
   const status = req.query.status || "";
   const offset = limit * page;

   const totalRows = await prisma.event.count({
      where: {
         ...(status && { status }),
         OR: [
            {
               name: {
                  contains: search,
               }
            }
         ]
      }
   });

   const totalPage = Math.ceil(totalRows / limit);

   const result = await prisma.event.findMany({
      where: {
         ...(status && { status }),
         OR: [
            {
               name: {
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

// UPDATE
export const UpdateEvent = async (req, res) => {

   const { name, place, link, status, image, descriptions, reasons, notes, date, time, details, speakerName, speakerImage, speakerPosition, speakerBiography } = req.body;

   try {

      const { eventId, speakerId } = req.params;
      let eventResponse, speakerResponse;

      if (name || place || link || status || image || descriptions || reasons || notes || date || time || details) {
         eventResponse = await prisma.event.update({
            where: { id: Number(eventId) },
            data: {
               ...(name && { name }),
               ...(place && { place }),
               ...(link && { link }),
               ...(status && { status }),
               ...(image && { image }),
               ...(descriptions && { descriptions }),
               ...(reasons && { reasons }),
               ...(notes && { notes }),
               ...(date && { date }),
               ...(time && { time }),
               ...(details && { details }),
            }
         })
      }

      if (speakerName || speakerImage || speakerBiography || speakerPosition) {
         speakerResponse = await prisma.speaker.update({
            where: { id: Number(speakerId) },
            data: {
               ...(speakerName && { speakerName: speakerName }),
               ...(speakerImage && { speakerImage: speakerImage }),
               ...(speakerBiography && { speakerBiography: speakerBiography }),
               ...(speakerPosition && { speakerPosition: speakerPosition }),
            }
         })
      }

      if (!eventResponse && !speakerResponse) {
         res.status(400).json({ msg: "Something wrong..." })
      }

      res.status(200).json({
         msg: "Data has been updated",
         event: eventResponse,
         speaker: speakerResponse
      })

   } catch (error) {
      res.status(500).json({ msg: error.message })
   }

}

// DELETE
export const DeleteEvent = async (req, res) => {
   const { id } = req.params;
   try {
      const response = await prisma.event.delete({
         where: { id: Number(id) }
      })
      if (!response) return res.status(404).json({ msg: "Event not found!" })
      res.status(200).json({ msg: "Event has been deleted", response })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

// GET EVENT BY ID
export const GetEventById = async (req, res) => {
   const { id } = req.params;
   try {
      const response = await prisma.event.findFirst({
         where: { id: Number(id) }
      })
      res.status(200).json(response)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}