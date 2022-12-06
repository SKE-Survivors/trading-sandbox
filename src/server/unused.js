const express = require("express")
const axios = require("axios").default

const { Server } = require("ws")

const sockserver = new Server({ port: 443 })
sockserver.on("connection", (ws) => {
  console.log("New client connected!")
  ws.on("close", () => console.log("Client has disconnected!"))
})

setInterval(() => {
  let res;
  sockserver.clients.forEach(async (client) => {
    res = await axios.get(
      "https://api.coinlore.net/api/ticker/?id=90")
    console.log(res.data)
    client.send(res.data)
  })

  // sockserver.clients.forEach(async (client) => {
  //     let res = await axios.get(
  //       "https://api.coinlore.net/api/ticker/?id=90", 
  //       {
  //         responseType: 'json'
  //       })
  //     console.log(res.data)
  //     client.send(res.data)
  //   })
  //   axios.get("https://api.coinlore.net/api/ticker/?id=90").then((res) => {
  //     rate = res.data
  //     console.log("eee", rate)
  //     client.send(rate)
  //   })
  // })
}, 5000)
//S1
const sendReq = async () => {
  const res = await axios.get(
    "https://api.coinlore.net/api/ticker/?id=90")
    .then(res => console.log(res.data))
    .then(res => {
      return res
      // console.log(res.data)
      // console.log("send 2")
    })
  // console.log("send 1")
  // console.log(res.data)

}
sendReq()
//End S1

const server = express()
  .use((req, res) => res.sendFile("../App.vue", { root: __dirname }))
  .listen(4000, () => console.log(`Listening on ${4000}`))
