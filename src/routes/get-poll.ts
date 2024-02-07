import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function getPoll(app:FastifyInstance){
  app.get('/polls/:pollId',async (req:FastifyRequest,reply:FastifyReply) => {
  const getPollParams = z.object({
    pollId:z.string().uuid()
  })

  const { pollId } = getPollParams.parse(req.params)
  
  const poll = await prisma.poll.findUnique({
    where:{
      id:pollId
    },
    include:{
      options: {
        select:{
           id: true,
           title:true
        }
      }
    }
  })
  
  reply.send(poll)
})
}