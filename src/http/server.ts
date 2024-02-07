import fastify, { FastifyRequest } from "fastify"
import { z } from 'zod'
import { createPoll } from "../routes/create-poll"
import { getPoll } from "../routes/get-poll"
import { voteOnPoll } from "../routes/vote-on-poll"
import cookie from "@fastify/cookie"

const app = fastify()

app.register(cookie,{
  secret:'iaepuwdfhrbguyi8ewrdfhuawERFTRWGHERGTY894H23WRT5Y93HIJF0ODM',
  hook:'onRequest',
  parseOptions:{}
})


app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)


app.listen({port:3334}).then(()=>{
  console.log("👊 Http server is now running!")
})