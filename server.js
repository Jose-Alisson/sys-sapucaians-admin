const express = require('express')

const port = process.env?.['PORT'] || 5000
const app = express()

app.use(express.static(__dirname + "/dist/joliny-admin/browser/" ))

app.get("**", (req,res) => {
    res.sendFile(__dirname + "/dist/joliny-admin/browser/index.html")
})

app.listen(port, () => {
    console.log(`Servidor iniciou na porta: ${port}`)
})