const express = require('express')
const router = express.Router()

const Auction = require('../models/Auction')
const Item = require('../models/Item')
const verifyToken = require('../verifyToken')



// this secondsToHms function was found here: https://www.codegrepper.com/code-examples/javascript/convert+timestamp+to+hours+minutes+seconds+javascript
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET ALL AUCTIONS : api endpoint = localhost:3000/api/auction/ 
/*
*/
router.get('/', verifyToken, async(req,res) =>{

    // const timeNowInt = Math.floor(new Date().getTime() / 1000)
    // console.log(timeNowInt)
    // const expiration = await Auction.find({}, {auction_expiration_date : 1} )
    // var expirationparse = expiration[0]['auction_expiration_date']
    // const expirationInt = Math.floor(new Date(expirationparse) / 1000)
    // console.log(expirationInt)
    // var timeLeft = 'Auction has ended'
    // if(expirationInt > timeNowInt){
    //     timeLeft = secondsToHms(expirationInt - timeNowInt)
    // }
    try{
        const auctions_listed = await Auction.find()
        // res.send(mergedObject ={auction, timeLeft})
        res.send(mergedObject ={auctions_listed})

    }catch(err){
        res.status(400).send({message:err}) 
    }
})




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET JUST ONE AUTCTION ITEMS FOR USING ITEM ID : api endpoint = localhost:3000/api/auction/item
/*
{
    "auction_item_id": "62655527d1b70de9d1235434"
}
*/
router.get('/item', verifyToken, async(req,res) =>{


    // Vallidation to chech there is time left to bid
    const timeNowInt = Math.floor(new Date().getTime() / 1000)
    const expiration = await Auction.find({auction_item_id:req.body.auction_item_id}, {auction_expiration_date : 1} )
    var expirationparse = expiration[0]['auction_expiration_date']
    const expirationInt = Math.floor(new Date(expirationparse) / 1000)
    var timeLeft = 'Auction has ended'
    if(expirationInt > timeNowInt){
        timeLeft = 'Auction Time Remaining: '+secondsToHms(expirationInt - timeNowInt)
    }
    // console.log(timeLeft)
    try{
        const auctions = await Auction.find({ auction_item_id: req.body.auction_item_id })
        const item = await Item.find({_id : req.body.auction_item_id})
        res.send(auctions + item + timeLeft)
        // res.send(auctions + item)

    }catch(err){
        res.status(400).send({message:err}) 
    }
})




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// POST NEW AUCTION : api endpoint = localhost:3000/api/auction/post 
/*
{
    "auction_item_id": "62655527d1b70de9d1235434",
    "auction_expiration_date": "2022-04-29T12:36:06.591Z",
    "auction_live_status": true
}
*/
router.post('/post', verifyToken, async(req,res)=>{
    // Code to insert data (after check user, dupl, encrypt pass)

    // Validation 1 to check if auction exists
    const auctionExists = await Auction.findOne({auction_item_id:req.body.auction_item_id})
    if(auctionExists){
        return res.status(400).send({message:'Auction already exists'})
    }

    // Validation 2 to check if item exists
    const itemExists = await Item.findOne({_id:req.body.auction_item_id})
    if(!itemExists){
        return res.status(400).send({message:'Item does not exist. Please post new item'})
    }

    // finds items to place on auction by item ID (unique)
    const item_info = await Item.find({ _id:req.body.auction_item_id })
    
    // get item title from Item db entry to populate auction title
    const title = await Item.find({_id:req.body.auction_item_id}, {item_title : 1} )
    var item_title = title[0]['item_title']
    // console.log(item_title)

    // creates auction using item ID
    const auction = new Auction({
        // auction posters have to enter the same item ID generated when posting a new item
        auction_item_id:req.body.auction_item_id, 
        auction_live_status:req.body.auction_live_status,
        auction_expiration_date:req.body.auction_expiration_date,
        auction_item_title:item_title
    })
    try{
        const auction_details = await auction.save()
        res.send(mergedObject ={item_info, auction_details})
    }catch(err){
        res.status(400).send({message:err})
    }
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE (Delete) : api endpoint = localhost:3000/api/auction/delete 
/*
{
    "auction_id": "62654538af27b5ae92319411"
}
*/
router.delete('/delete', verifyToken, async(req,res)=>{
    try{
        // delete auction using Auction ID:
        const deleteAuctionById = await Auction.deleteOne({_id:req.body.auction_id})
        res.send(deleteAuctionById)
    }catch(err){
        res.send({message:err})
    }
   })


// export the router :
module.exports = router