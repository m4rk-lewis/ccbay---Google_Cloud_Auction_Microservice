const mongoose = require('mongoose')

// the schema
const bidSchema = mongoose.Schema({
    auction_id:{     //the unique ID generated when posting a new item
        type:String,
        require:true,
        min:6,
        max:1080
    },
    bid_new_bid:{  
        type:Number,
        default:0
    },
    bid_bidder_id:{
        type:String,
        min:6,
        max:1080,
        default:'No Biders Yet'
    },
    bid_timetamp:{     //javascript epoch seconds = Math.floor(new Date().getTime() / 1000)
        require:true,
        type:Date,
        default:Date.now
    }
})

// export the schema
module.exports = mongoose.model('bids',bidSchema)