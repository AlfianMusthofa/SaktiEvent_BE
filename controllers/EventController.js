import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient();
import prisma from '../lib/prisma.js';
import path from 'path'
import fs from 'fs'

// CREATE
export const AddEvent = async (req, res) => {

   if (req.files === null) return res.status(400).json({ msg: 'No file uploaded' })

   const { name,
      place,
      link,
      status,
      descriptions,
      reasons,
      notes,
      date,
      time,
      details,
      speakerName, speakerPosition, speakerBiography } = req.body;

   const file = req.files.file; // Event Image
   const speakerImage = req.files.speakerImage; // Speaker Image

   const fileSize = file.data.length;
   const ext = path.extname(file.name);
   const fileName = file.md5 + ext;
   const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

   const allowedType = ['.png', '.jpg', '.jpeg'];

   if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid image' })
   if (fileSize > 5000000) return res.status(422).json({ mgs: 'Gambar terlalu besar!' })

   let speakerImageFileName = null;
   let speakerImageUrl = null;

   if (speakerImage) {

      const speakerImageSize = speakerImage.data.length;
      const speakerExt = path.extname(speakerImage.name);
      speakerImageFileName = speakerImage.md5 + speakerExt;
      speakerImageUrl = `${req.protocol}://${req.get("host")}/images/${speakerImageFileName}`

      if (!allowedType.includes(speakerExt.toLowerCase())) return res.status(422).json({ msg: 'Invalid speaker image' });
      if (speakerImageSize > 5000000) return res.status(422).json({ msg: 'Speaker image terlalu besar!' });

   }

   file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message })

      if (speakerImage) {
         speakerImage.mv(`./public/images/${speakerImageFileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
         })
      }

      try {
         const eventResponse = await prisma.event.create({
            data: {
               eventName: name,
               place: place,
               link: link,
               status: status,
               eventImage: fileName,
               url: url,
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
               speakerImage: speakerImageFileName,
               speakerBiography: speakerBiography,
               speakerPosition: speakerPosition,
               urlimage: speakerImageUrl,
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
   })
}

// READ
export const GetAllEvents = async (req, res) => {

   const page = parseInt(req.query.page) || 0;
   const limit = parseInt(req.query.limit) || 10;
   const search = req.query.search_query || "";
   const status = req.query.status || "Active";
   const offset = limit * page;

   const totalRows = await prisma.event.count({
      where: {
         ...(status && { status }),
         OR: [
            {
               eventName: {
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
               eventName: {
                  contains: search,
               }
            }
         ]
      },
      skip: offset,
      take: limit,
      orderBy: {
         id: 'desc'
      },
      include: {
         Speaker: true,
         EventUser: {
            include: {
               User: true
            }
         }
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

   const { id } = req.params;
   const { name,
      place,
      link,
      status,
      descriptions,
      reasons,
      notes,
      date,
      time,
      details,
      speakerName, speakerPosition, speakerBiography } = req.body;

   const event = await prisma.event.findFirst({
      where: {
         id: Number(id)
      }
   })

   const speaker = await prisma.speaker.findFirst({
      where: {
         id: Number(id)
      }
   })

   if (!event || !speaker) return res.status(404).json({ msg: "Event or speaker not found!" })

   let eventImage = event.eventImage;
   let speakerImage = speaker.speakerImage;


   if (req.files && req.files.file) {

      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const newFileName = file.md5 + ext;

      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) {
         return res.status(422).json({ msg: 'Invalid image format!' });
      }
      if (fileSize > 5000000) {
         return res.status(422).json({ msg: 'Image is too large!' });
      }

      if (event.eventImage) {
         const oldImagePathEvent = `./public/images/${event.image}`;
         if (fs.existsSync(oldImagePathEvent)) {
            fs.unlinkSync(oldImagePathEvent);
         }
      }

      file.mv(`./public/images/${newFileName}`, (err) => {
         if (err) return res.status(500).json({ msg: err.message });
      });

      eventImage = newFileName;

   }

   const url = `${req.protocol}://${req.get("host")}/images/${eventImage}`

   if (req.files && req.files.speakerImage) {
      const speakerFile = req.files.speakerImage;
      const speakerFileSize = speakerFile.data.length;
      const speakerExt = path.extname(speakerFile.name);
      const newSpeakerFileName = speakerFile.md5 + speakerExt;

      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(speakerExt.toLowerCase())) {
         return res.status(422).json({ msg: 'Invalid speaker image format!' });
      }
      if (speakerFileSize > 5000000) {
         return res.status(422).json({ msg: 'Speaker image is too large!' });
      }

      if (speaker.speakerImage) {
         const oldImagePathSpeaker = `./public/images/${speaker.speakerImage}`;
         if (fs.existsSync(oldImagePathSpeaker)) {
            fs.unlinkSync(oldImagePathSpeaker);
         }
      }

      speakerFile.mv(`./public/images/${newSpeakerFileName}`, (err) => {
         if (err) return res.status(500).json({ msg: err.message });
      });

      speakerImage = newSpeakerFileName;
   }

   const urlimage = `${req.protocol}://${req.get("host")}/images/${speakerImage}`

   try {

      const updateEvent = await prisma.event.update({
         data: {
            eventName: name ?? event.eventName,
            place: place ?? event.place,
            link: link ?? event.link,
            status: status ?? event.status,
            descriptions: descriptions ?? event.descriptions,
            reasons: reasons ?? event.reasons,
            notes: notes ?? event.notes,
            date: date ?? event.date,
            time: time ?? event.time,
            details: details ?? event.details,
            eventImage: eventImage ?? event.eventImage,
            url: url ?? event.url
         }, where: {
            id: Number(id)
         }
      })

      const updateSpeaker = await prisma.speaker.update({
         data: {
            speakerName: speakerName ?? speaker.speakerName,
            speakerBiography: speakerBiography ?? speaker.speakerBiography,
            speakerPosition: speakerPosition ?? speaker.speakerPosition,
            speakerImage: speakerImage ?? speaker.speakerImage,
            urlimage: urlimage ?? speaker.urlimage
         }, where: {
            id: Number(id)
         }
      })

      if (!updateEvent && !updateSpeaker) return res.status(400).json({ msg: "Update event or update speaker is invalid!" })

      res.status(200).json({ msg: "Event has been updated!", updateEvent })

   } catch (error) {
      console.log(error)
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
         where: {
            id: Number(id)
         },
         include: {
            Speaker: true,
            EventUser: {
               include: {
                  User: true
               }
            }
         }
      })
      res.status(200).json(response)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const AddUserToEvent = async (req, res) => {
   const { userId, eventId } = req.params;

   const userIdNum = Number(userId);
   const eventIdNum = Number(eventId);

   try {
      // Pastikan user dan event ada
      const isUserExist = await prisma.user.findUnique({
         where: { id: userIdNum }
      });

      const isEventExist = await prisma.event.findUnique({
         where: { id: eventIdNum }
      });

      if (!isUserExist || !isEventExist) {
         return res.status(404).json({ msg: "User or Event not found!" });
      }

      const existingEntry = await prisma.eventUser.findFirst({
         where: {
            userId: userIdNum,
            eventId: eventIdNum
         }
      });

      if (existingEntry) {
         return res.status(400).json({ msg: "User already registered for this event" });
      }

      const newEventUser = await prisma.eventUser.create({
         data: {
            userId: userIdNum,
            eventId: eventIdNum
         }
      });

      const responseHistoryUser = await prisma.history.create({
         data: {
            userId: userIdNum,
            eventId: eventIdNum
         }
      });

      if (!newEventUser || !responseHistoryUser) return res.status(400).json({ msg: "Something wrong with with AddEventUser or Response history user" })

      return res.status(201).json({
         msg: "Register success",
         eventUser: newEventUser
      });

   } catch (error) {
      return res.status(500).json({ msg: error.message });
   }
};


export const checkUserRegistrationEvent = async (req, res) => {
   const { userId, eventId } = req.params;
   try {
      const existingEntry = await prisma.eventUser.findFirst({
         where: {
            userId: Number(userId),
            eventId: Number(eventId)
         }
      })

      if (!existingEntry) return res.status(404).json({ msg: 'Not registered' })

      res.status(200).json({ msg: 'Registered', existingEntry });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
}