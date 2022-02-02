const express = require('express')
const res = require('express/lib/response')
port = 9999
const app=express()
app.use(express.json())
const con = require('mongoose')
const mongoURI = "mongodb+srv://root:fnAYHT3kOEebCQS5@cluster0.zjx3h.mongodb.net/customer?retryWrites=true&w=majority";
//connectiong to mongoose 
con.connect(mongoURI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
//con.connect("mongodb+srv://root:<fnAYHT3kOEebCQS5>@cluster0.zjx3h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
//mongodb+srv://root:<fnAYHT3kOEebCQS5>@cluster0.zjx3h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
if(con){console.log("connected to mongoose")}
else{console.log("unable to connected to mongoose")}
//connected to mongoose

//console.log(Math.random().toString(16).slice(2))

//serven hosted on 9999
app.listen(
    port,
    ()=>{console.log("started at ", port)}
)
{}

const customer = con.model("customer", {
    _id: {
        type: String,
        unique: true,
        required: [true, ""],
    },
    name: {
        type: String,
        unique: true,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter your email"],
    },
    mobile: {
        type: Number,
        required: [true, "Please enter your mobile number"],
        minlength: 10,
        maxlength: 10,
    },
    city: {
        type: String,
        required: [true, "Please enter the Country"]
    }
})

app.post('/q_one',(req,res)=>{
    const data = req.body
    id = Math.random().toString(16).slice(2)
    const cust_data = new customer({
        _id:id,
        name:data.name,
        email: data.email,
        mobile: data.mobile,
        city: data.city,
    })
    try { cust_data.save()}
    catch(e){console.log("this is error in try block",e)}
    console.log(data)
    res.status(200).send({
        message :'details of customer added to db successfully with id',
        unq_id:id
    })
})



//id1->'6d2f18e05d79d'|
const purchase = con.model("purchase", {
    _id: {
        type: String,
        unique: true,
        required: [true, ""],
    },
    p_name: {
        type: String,
        unique: true,
        required: [true, "Please enter your name"],
    },
    quantity: {
        type:  Number,
        //unique: true,
        required: [true, "Please enter your qunaity"],
    },
    pricing: {
        type: Number,
        required: [true, "Please enter your pricing"],
    },
    mrp: {
        type: Number,
        required: [true, "Please enter your mrp"],
    },
    c_id: {
        type: String,
        required: [true, "Please enter the unique of customer"]
    }
})
//question 2 purchase details #customer unique id
app.post('/q_two',(req,res)=>{
    const data = req.body
    id = Math.random().toString(16).slice(2)
    const pur_data = new purchase({
        _id:id,
        p_name:data.p_name,
        quantity: data.quantity,
        pricing: data.pricing,
        mrp: data.mrp,
        //ObjectId("61f80a9c642a8fde5f2b2093")
        c_id:data.customerid
    })
    if(data.pricing>data.mrp){res.status(400).send({message :'pricing cant be grater than mrp'})}

    try { pur_data.save()}
    catch(e){}//{console.log("this is error in try block",e)}
    console.log(data)
    res.status(200).send({
        message :'details of purchase added to db successfully',
        Pur_id:id,
        cust_id:data.customerid
    })


})



const shipment = con.model("shipment", {
    _id: {
        type: String,
        unique: true,
        required: [true, ""],
    },
    address: {
        type: String,
        unique: true,
        required: [true, ""],
    },
    city: {
        type:  String,
        //unique: true,
        required: [true, ""],
    },
    pincode: {
        type: Number,
        required: [true, ""],
    },
    p_id: {
        type: String,
        required: [true, ""],
    },
    c_id: {
        type: String,
        required: [true, ""]
    }
})
//shipment detials which have both the customer id and shipment id
app.post('/q_three',(req,res)=>{

    const data = req.body
    id = Math.random().toString(16).slice(2)
    const ship = new shipment({
        _id:id,
        address:data.address,
        city: data.city,
        pincode: data.pincode,
        p_id: data.pid,
        c_id:data.cid
    })
    try { ship.save();console.log("saved in db")}
    catch(e){}//{console.log("this is error in try block",e)}
    console.log(data)
    res.status(200).send({
       message :'details of shipment addedd successfully'

    })

})



/*
app.post('/cust_data/:id',(req,res)=>{
const{id}=req.params;
const{fname,lname}=req.body;
console.log(fname,lname,id)
if(fname.length>1)
{res.status(201).send({fname,lname})}

})*/




app.get('/q_four/:id',(req,res)=>{
    var {id} = req.params;
    console.log(id)
    shipment.findOne({city:id},(err,result)=>{
        if(err){}
        console.log(result.c_id)
        customer.findOne({"_id":result.c_id},(err,result)=>{
        console.log(result)
        {res.status(201).send({result})}
            
        })
    })  
})

app.get('/q_five/',(req,res)=>{

    customer.find({},(err,result1)=>{
        if(err){}
        purchase.find({},(err,result2)=>{
        if(err){}
         console.log(result2)
        result = result1+result2
        {res.status(201).send({customers:result1,purchases:result2})}
            
        })
    })  
    
})

app.get('/q_six/',(req,res)=>{

    customer.find({},(err,result1)=>{
        if(err){}
        purchase.find({},(err,result2)=>{
        if(err){}
         console.log(result2)
            shipment.find({},(err,result3)=>{
                if(err){}
        {res.status(201).send({customers:result1,purchases:result2,shipment:result3})}


            })
            
        })
    })  
    
})
