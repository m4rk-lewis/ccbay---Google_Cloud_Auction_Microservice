const req = require('express/lib/request')
const mongoose = require('mongoose')
const User = require('./User')

// the schema
const itemSchema = mongoose.Schema({

    // the title is eessential and required
    item_title:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    // the timestamp will be generated at the time of posting
    item_timestamp:{
        type:Date,
        default:Date.now
    },
    // the condition bool is eessential and required
    item_used:{
        type:Boolean,
        require:true     
    },
    // description is required
    item_description:{
        type:String,
        require:true,
        min:6,
        max:1080
    },
    // this is not required, it will add the logged in uder's user id
    item_owner_user_id:{
        require:true,
        type:String,
        min:3,
        max:256
    },
    // this is not required. If blank, will default to user location. Gives ability to remote send items
    item_location:{
        type:String
    }
})


// export the schema
module.exports = mongoose.model('items',itemSchema)