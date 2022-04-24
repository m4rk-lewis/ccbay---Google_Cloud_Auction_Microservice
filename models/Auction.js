const mongoose = require('mongoose')

// the schema
const auctionSchema = mongoose.Schema({
    auction_id:{
        type:String,
        require:true,
        min:6,
        max:1080
    },
    auction_item_title:{
        require:true,
        type:String,
        require:true,
        min:6,
        max:256
    },
    auction_item_id:{     //the unique ID generated when posting a new item
        type:String,
        require:true,
        min:6,
        max:1080
    },
    auction_best_bid:{  
        type:Number,
        default:0
    },
    auction_best_bidder_id:{
        type:String,
        min:6,
        max:1080,
        default:'No Biders Yet'
    },
    auction_live_status:{   //auction_expiration_date must be after current tim efor this to be true
        type:Boolean,
        require:true
    },
    auction_expiration_date:{
        require:true,
        type:Date
    },
    auction_time_left:{     //javascript epoch seconds = Math.floor(new Date().getTime() / 1000)
        type:String,
    }
})

// export the schema
module.exports = mongoose.model('auctions',auctionSchema)