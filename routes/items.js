const express = require('express')
const router = express.Router()

const Item = require('../models/Item')
const verifyToken = require('../verifyToken')


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET ALL ITEMS FOR LOGGED IN USER : api endpoint = localhost:3000/api/item/
/*
*/
router.get('/', verifyToken, async(req,res) =>{
    try{
        const items = await Item.find({ item_owner_user_id: req.user._id })
        res.send(items)
    }catch(err){
        res.status(400).send({message:err}) 
    }
})



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// POST NEW ITEM : api endpoint = localhost:3000/api/item/post
/*
{
    "item_title": "nick Item 3",
    "item_used": true,
    "item_description": "description of nick item 3",
    "item_location": "Los Angeles"
}
*/
router.post('/post', verifyToken, async(req,res)=>{
    // Code to insert data (after check user, dupl, encrypt pass)
    const item = new Item({
        item_title:req.body.item_title,
        item_timestamp:req.body.item_timestamp,
        item_used:req.body.item_used,
        item_description:req.body.item_description,
        item_owner_user_id:req.user._id,
        item_location:req.body.item_location
    })
    try{
        const savedItem = await item.save()
        res.send(savedItem)
    }catch(err){
        res.status(400).send({message:err})
    }
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE (Delete) : api endpoint = localhost:3000/api/item/delete
/*
{
    "item_id": "62654494af27b5ae92319407"
}
*/
router.delete('/delete',async(req,res)=>{
    try{
    const deleteItemById = await Item.deleteOne({_id:req.body.item_id},)//, item_owner_user_id:req.user._id
    res.send(deleteItemById)
    }catch(err){
    res.send({message:err})
    }
   })


// export the router :
module.exports = router