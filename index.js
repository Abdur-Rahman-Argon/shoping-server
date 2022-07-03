const express = require('express')
const  cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())

app.get('/products/:id', (req, res, next)=>{
  res.send({'This is server is running'})
})

app.listen(port,()=>{
  console.log('server running port', port)
})