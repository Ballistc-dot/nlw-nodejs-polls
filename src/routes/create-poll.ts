import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function createPoll(app:FastifyInstance){
  app.post('/polls',async (req:FastifyRequest,reply:FastifyReply) => {
  const createPollBody = z.object({
    title: z.string(),
    options: z.array(z.string())
  })

  const { title, options } = createPollBody.parse(req.body)
  
  const poll = await prisma.poll.create({
    data:{
      title,
      options:{
        createMany:{
          data:options.map(option =>{
            return {  title:option  }
          })
        }
      }
    }
  })
  
  reply.status(201).send(poll)
})
}