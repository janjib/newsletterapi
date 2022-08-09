const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const request = require("request")
const PORT = process.env.PORT || 3000
const https = require("https")
// api key : 8c06de3dc112f328f4ac769afc81badb-us18
// audience id : 17c39753cb
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.post("/",(req,res)=>{
    const {fName, lName, email} = req.body
    const data = {
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME: fName,
                LNAME: lName
            }

        }]
    }
    const jsonData = JSON.stringify(data)

    const url = `https://us18.api.mailchimp.com/3.0/lists/17c39753cb`

    const options = {
        method:"POST",
        auth:"janjibdev@gmail.com:8c06de3dc112f328f4ac769afc81badb-us18"
    }
    const request = https.request(url, options, (response)=>{
        response.on("data", ()=>{
            let statusCode = response.statusCode
            if (statusCode == 200)
            {
                res.status(200).sendFile(__dirname + "/success.html")
            }
            else
            {
                res.status(statusCode).sendFile(__dirname + "/failure.html")
            } 
        })
    })
    request.write(jsonData)
    request.end()
})
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})