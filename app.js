const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

//this is where all the API routes are linked to
const auctionsRoute = require('./routes/auctions')
const itemsRoute = require('./routes/items')
const authRoute = require('./routes/auth')
const bidRoute = require('./routes/bids')
app.use('/api/auction',auctionsRoute)
app.use('/api/item',itemsRoute)
app.use('/api/user',authRoute)
app.use('/api/bid',bidRoute)


app.get('/', (req,res)=>{
    res.send('Docker contains ccbay app')
})


// connect to Mongo DB (DB_CONNECTOR is stored in .env)
mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected')
})


// use the 3000 port to the server
app.listen(3000, ()=>{
    console.log('Server is running')
})