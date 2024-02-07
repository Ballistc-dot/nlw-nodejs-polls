import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { randomUUID } from "crypto"

export async function voteOnPoll(app:FastifyInstance){
  app.post('/polls/:pollId/votes',async (req:FastifyRequest,reply:FastifyReply) => {
  const voteOnPollBody = z.object({
    pollOptionId:z.string().uuid(),
  })

  const voteOnPollParams = z.object({
    pollId: z.string().uuid()
  })

  const { pollOptionId } = voteOnPollBody.parse(req.body)
  const { pollId } = voteOnPollParams.parse(req.params)
  

  let { sessionId } = req.cookies

  if(sessionId){
    const userPreviousVoteOnPoll = await prisma.vote.findUnique({
      where:{
        sessionId_pollId:{
          pollId,
          sessionId
        }
      }
    })
    if(userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId){
      

      await prisma.vote.delete({
        where:{
          id: userPreviousVoteOnPoll.id
        }
      })
      
    }else if(userPreviousVoteOnPoll){
      return reply.status(400).send({ message:'You already voted on this poll.'})

    }
  }

  if(!sessionId){
    sessionId = randomUUID()
    
    reply.setCookie('sessionId',sessionId,{
      path:'/',
      maxAge: 60 * 60 * 24 * 30,
      signed: true,
      httpOnly: true,
    })

  }

  

  const vote =  await prisma.vote.create({
    data:{
      sessionId,
      pollId,
      pollOptionId
    }
  })

  return reply.send({ vote  })
})
}