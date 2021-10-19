const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
   const url = req.url
   const method = req.method
   if (url === "/") {
      res.setHeader("Content-Type", "text/html")
      res.write("<html>")
      res.write("<head><title>Enter Message</title></head>")
      res.write(
         "<body><form action='/message' method='POST'><input type='text' name='message' placeholder='Enter words'/><input type='submit'/></form></body>"
      )
      res.write("</html>")
      return res.end()
   } else if (url === "/message" && method === "POST") {
      const body = []
      req.on("data", chunk => {
         console.log(chunk)
         body.push(chunk)
      })
      return req.on("end", () => {
         const parsedBody = Buffer.concat(body).toString()
         console.log(parsedBody)
         const message = parsedBody.split("=")[1].replace(/\+/g, " ")
         console.log(message)
         fs.writeFile("message.txt", message, err => {
            res.statusCode = 302
            res.setHeader("Location", "/")
            return res.end()
         })
      })
   } else {
      res.setHeader("Content-Type", "application/json")
      let obj = { hello: "world" }
      res.write(JSON.stringify(obj))
      res.end()
   }
   //    process.exit()
})

server.listen(3000)
