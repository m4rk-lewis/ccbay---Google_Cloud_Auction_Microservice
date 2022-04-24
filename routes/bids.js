const express = require('express')
const router = express.Router()

const Auction = require('../models/Auction')
const Bid = require('../models/Bid')
const Item = require('../models/Item')
const verifyToken = require('../verifyToken')



// this function was found here: https://www.codegrepper.com/code-examples/javascript/convert+timestamp+to+hours+minutes+seconds+javascript
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
// GET BID HISTORY FOR SPECIFIED AUCTION_ID : api endpoint = localhost:3000/api/item/
/*
{
    "auction_id": "62654494af27b5ae92319407"
}
*/
router.get('/', verifyToken, async(req,res) =>{

    try{
        const bids = await Bid.find({auction_id:req.body.auction_id})
        res.send(bids)
    }catch(err){
        res.status(400).send({message:err}) 
    }
})






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BID ON AUCTIONS : api endpoint = localhost:3000/api/bid/new
/*
{
    "auction_item_id": "626521a9a6f40ebb3fc932dc",
    "bid_new_bid": 27.99
}
*/
router.patch('/new', verifyToken, async(req,res)=>{

    // Vallidation to chech there is time left to bid
    const timeNowInt = Math.floor(new Date().getTime() / 1000)
    const expiration = await Auction.find({auction_item_id:req.body.auction_item_id}, {auction_expiration_date : 1} )
    var expirationparse = expiration[0]['auction_expiration_date']
    const expirationInt = Math.floor(new Date(expirationparse) / 1000)
    if(expirationInt < timeNowInt){
        return res.status(400).send({message:'Auction has completed'})
    }



    // Validation to check if _id is not item_owner_user_id AND auction_item_id = item id
    const userIdCheck = await Item.findOne({_id:req.body.auction_item_id, item_owner_user_id:req.user._id} )
    // console.log(userIdCheck)
    if(userIdCheck){
        return res.status(400).send({message:'You cannot bid on your own auction'})
    }


    
    // Validation to check if auction exists
    const auctionExists = await Auction.findOne({auction_item_id:req.body.auction_item_id})
    if(!auctionExists){
        return res.status(400).send({message:'Auction does not exists'})
    }


    // FETCH CURRENT BEST BID IN SPECIFIED AUCTION 
    const currentBid = await Auction.find({auction_item_id:req.body.auction_item_id}, {auction_best_bid : 1} )
    var curBestBid = currentBid[0]['auction_best_bid']

    // Validation 3 to check if new bid higher than current best 
    if(req.body.bid_new_bid <= curBestBid){
        return res.status(400).send({message: 'Bid must be larger than current bid'})
    }

    try{
        // update the auction best bid and bidder
        const updateBidByID = await Auction.updateOne(
            {auction_item_id:req.body.auction_item_id},
            {$set: {"auction_best_bid": req.body.bid_new_bid, "auction_best_bidder_id": req.user._id}})
        
        // post the bids to bid DB
        const bids = new Bid({
            auction_id:req.body.auction_item_id,
            bid_new_bid:req.body.bid_new_bid,
            bid_bidder_id:req.user._id,
            bid_timetamp:req.body.bid_timetamp
        })
        const savedBids = await bids.save()
            res.send(mergedObject ={updateBidByID, savedBids})
    }catch(err){
        return res.status(400).send({message:'Bid failed'})
    }
})


// export the router :
module.exports = router