require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const e = require('express')
const Razorpay = require('razorpay')
const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils');


const instance = new Razorpay({key_id:process.env.RAZOR_KEY_ID,key_secret:process.env.RAZOR_KEY_SECRET})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express()
app.use(cors())

const server = http.createServer(app)

app.use(express.json())

const io = new Server(server,{
  cors:{
    origin:'http://localhost:3004',
    methods:['GET','POST'],
  },
})

io.on("connection",(socket) => {
  console.log('User Connected',socket.id)
  
  
  socket.on("join_room",(data) => {
    socket.join(data);
    console.log("Joined room",data)
  })

  socket.on('send_message',async(data) => {

    const chatObj = await db.collection('chats').findOne({roomName:data.room})
    let chats = []
    if(chatObj !== null){
      chats = chatObj.chats
    }
    console.log(chats)

    socket.to(data.room).emit('recieve_msg',[...chats,{user:data.user,text:data.message}])

    db.collection('chats').updateOne({roomName:data.room},{$set:{chats:[...chats,{user:data.user,text:data.message}]}})
    
  })

  socket.on('disconnect',() => {
    console.log('User Disconnected',socket.id)
  })
})

const db = client.db("AppSubscriptor")


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
  next()
});

const authorizeTheUser = async(req,res,next) => {
  try{
    let jwt_token;
    const authHeader = req.headers['authorization']
    if(authHeader !== undefined){
      jwt_token = authHeader.split(" ")[1]
    }
    if(jwt_token === undefined){
      res.status(401).send({data:'Not Authorized Yet to add offer.'})
    }
    else{
      jwt.verify(jwt_token,'Secret Token',async(error,payload) => {
        if(error){
          res.status(401).send({data:'Not Authorized Yet to add offer.'})
        }
        else{
          const {username} = payload
          req['username'] = username

          next()
        }
      })
    }
  }
  catch(e){
    console.log(e)
    res.status(400).send({data:'Something went wrong... Please try again.'})
  }
}

app.post('/changePassword',async(req,res,next) => {
  try{
    const {user,password} = req.body
    const hashed_password = await bcrypt.hash(password,10)
    const feed = await db.collection('user_data').updateOne({username:user},{$set:{password:hashed_password}})
    console.log(feed)
    if(feed.acknowledged){
      res.status(200).send({data:'Password Changed'})
    }else{
      res.status(401)
    }
  }catch(e){
    console.log(e)
    res.status(400)
  }
})

app.get('/checkMail/:mail',async(req,res,next) => {
  const {mail} = req.params
  const data = await db.collection('user_data').findOne({mail:mail})
  if(data === null){
    res.status(400).send({data:'Mail Not Found'})
  }else{
    res.status(200).send({data:'OK'})
  }
})

app.post('/raisePayment',async(req,res,next) => {
  try{
    const {username,raisedUser,plan,platform,amount,count} = req.body
    
    const multiplied_amt = count * amount
    const oustanding_amt = Math.ceil(multiplied_amt + (multiplied_amt * 0.1))

    var options = {
      amount:oustanding_amt*100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: 'Receipt001'
    };
    const order = await instance.orders.create(options)
    const data = {
      customer:username,
      owner:raisedUser,
      time:`${count} ${plan}${count>1?'s':''}`,
      platform,
      count,
      status:'Requested',
      order_id:order.id,
      amount:oustanding_amt,
      receipt:order.receipt,

    }

    console.log(order)
    const feed = await db.collection('payments').insertOne(data)

    
    if(feed.acknowledged ){
      res.status(200).send({data:'Payment raised succesfully'})
    }else{
      res.status(400).send({data:'Please try agian..'})
    }
  }catch(e){
    console.log(e)
    res.status(400).send({data:'Something went wrong'})
  }
})


app.get('/getRazorAPI',async(req,res,next)=>{
  res.send({api:process.env.RAZOR_KEY_ID})
})

app.get('/payments',authorizeTheUser,async(req,res,next)=>{
  try{
    const {username} = req
    // console.log(username)
    const pending = (await db.collection('payments').find({customer:username,status:'Requested'}).toArray()).reverse()
    const raised =  (await db.collection('payments').find({owner:username}).toArray()).reverse()
    const completed = (await db.collection('payments').find({customer:username,status:'Successful'}).toArray()).reverse()
    res.status(200).send({pending,raised,completed})
  }catch(e){
    console.log(e)
    res.status(400)
  }
})

app.delete('/delPayment',async(req,res,next)=>{
  try{
    const {id} = req.body
    const feed = await db.collection('payments').deleteOne({_id:new ObjectId(id)})
    if(feed.acknowledged){
      res.status(200).send({data:'Successfully Deleted'})
    }else{
      res.status(400).send({data:'Something went wrong..!'})
    }
  }catch(e){
    res.status(400).send({data:'Something went wrong..!'})
  }
})

app.post('/paymentVerification',async(req,res,next)=> {
  console.log(req.body)
  const {order_id,razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body

  // res.status(200).send({data:'Success'})
  const isValid = validatePaymentVerification({order_id:order_id,payment_id:razorpay_payment_id},razorpay_signature,process.env.RAZOR_KEY_SECRET)
  console.log(isValid)
  if(isValid){
    const feed  = await db.collection('payments').updateOne({order_id:order_id},{$set:{status:'Successful',payment_id:razorpay_payment_id}})
    res.status(200).send({pay_id:razorpay_payment_id})
  }else{
    res.status(400).send('Try Again')
  }
})


app.get('/checkUser/:username',async(req,res,next) => {
  const {username} = req.params
  const data = await db.collection('user_data').findOne({username:username})
  if(data === null){
    res.status(400).send({data:'Done'})
  }else{
    res.status(200).send({data:'Done'})
  } 
})

app.get('/')

app.post('/verifyMail',async(req,res,next) => {
  const {mail} = req.body
  console.log(req.body)
  sgMail.setApiKey(process.env.SEND_GRID_KEY);
  const code = Math.ceil(Math.random()*100000)
  console.log(code)
 
// setup e-mail data with unicode symbols
var mailOptions = {
    from: process.env.FROM_MAIL, // sender address
    to: mail, // list of receivers
    subject: 'OTP for Verification', // Subject line
    text: `Your one time verification code is ${code}`, // plaintext body
    html: `<b>Your one time verification code is ${code}</b>` // html body
};
 
sgMail.send(mailOptions).then(r => {
  console.log(r)
  res.send({otp:code})
}).catch(e => console.log(e))
})

app.post('/login',async(req,res,next) => {
   try{
        const {user,password} = req.body
        const user_data = await db.collection('user_data').findOne({"username":user})
        // res.send(user_data)
        console.log(user_data)
        if(user_data === null){
          res.status(400).send({
            data:"User Not Found"
          })
        }else{
          const is_password_true = await bcrypt.compare(password,user_data.password)
          if(is_password_true === true){
            const payload = {
              username:user
            }
            const jwt_token = jwt.sign(payload,`Secret Token`)
            res.send({jwt_token})
          }else{
            res.status(400).send({
              data:"Incorrect Password"
            })
          }
        }

    }catch(e){
        console.error(e)
    }
})

app.post('/register/',async(req,res,next) => {
  try{
    console.log(req.body)
    const {user,password,age,mobile,mail} = req.body
    console.log(user,password,age,mobile)
    const db_user = await db.collection('user_data').findOne({"username":user})
    const mail_check = await db.collection('user_data').findOne({mail:mail})
    // console.log(db_user)

    if(db_user === null && mail_check === null){
      const hashed_password = await bcrypt.hash(password,10)
      const feed = await db.collection('user_data').insertOne({username:user,password:hashed_password,age:age,mobile:mobile,mail:mail})
      const feed2 = await db.collection('chat_ids').insertOne({user,chats:[]})
      console.log(feed,feed2)
      // res.status(200).send(feed)
      const payload = {
              username:user
            }
      const jwt_token = jwt.sign(payload,`Secret Token`)
      res.send({jwt_token})
    }else if(db_user !== null){
      res.status(400).send({error:'Username is already in use'})
    }else if(mail_check !== null){
      res.status(400).send({error:'Mail is already in use'})
    }
    else{
      res.status(400).send({error:'Try again with different values'})
    }
    // console.log(params.details)
    
    

  }catch(e){
    console.error(e)
  }
})


app.get('/',async(req,res,next) => {
  try{
    const app_data = await db.collection('app_data').find({}).toArray()
    res.status(200).send(app_data)
  }catch(e){
    console.error(e)
  }
})

app.get('/notifications',authorizeTheUser,async(req,res,next) => {
  try{
    const {username} = req
    const notifications = await db.collection('notifications').find({raised_for:username}).toArray()
    res.send(notifications)
  }catch(e){
    console.log(e)
    res.status(400).send({data:'Something went wrong... Please try again.'})
  }
})

// app.post('/addChatNotification',async(req,res,next) => {
//   try{
//     const {platform,raised_for,raised_by,description} = req.body
//     const feed = await db.collection('notifications').insertOne({platform,raised_by,raised_for,description})
//     if(feed.acknowledged){
//       res.status(200).send({data:'Notification Added'})
//     }else{
//       res.status(400)
//     }
//   }catch(e){
//     console.log(e)
//     res.status(400)
//   }
// })

app.post('/addNotification',async(req,res,next) => {
  try{
    const {platform,raised_for,raised_by,description,type} = req.body
    const feed = await db.collection('notifications').insertOne({platform,raised_by,raised_for,description,type})
    let arr = [raised_by,raised_for]
    arr.sort()
    console.log(arr)
    const room = `${arr[0]}:${arr[1]}`
    const raised_by_chat_obj = await db.collection('chat_ids').findOne({user:raised_by})
    let raised_by_chat_arr = raised_by_chat_obj.chats
    if(! raised_by_chat_arr.includes(room)){
      raised_by_chat_arr.push(room)
    }
    db.collection('chat_ids').updateOne({user:raised_by},{$set:{chats:raised_by_chat_arr}})
    const raised_for_chat_obj = await db.collection('chat_ids').findOne({user:raised_for})
    let raised_for_chat_arr = raised_for_chat_obj.chats
    if(! raised_for_chat_arr.includes(room)){
      raised_for_chat_arr.push(room)
      const ack = await db.collection('chats').insertOne({roomName:room,chats:[]})
      console.log(ack)
    }
    db.collection('chat_ids').updateOne({user:raised_for},{$set:{chats:raised_for_chat_arr}})
    res.status(200).send(feed)
  }catch(e){
    console.log(e)
    res.status(400).send({data:'Something went wrong... Please try again.'})
  }
})

app.post('/addPaymentNotification',async(req,res,next) => {
  try{
    const {platform,raised_for,raised_by,description,type} = req.body
    const feed = await db.collection('notifications').insertOne({platform,raised_by,raised_for,description,type})
    if(feed.acknowledged){
      res.status(200).send({data:'Raised Successfully..!'})
    }
  }catch(e){
    res.status(400).send({data:'Something went wrong... Please try again'})
  }
})

app.get('/chat/:roomId',async(req,res,next) => {
  try{
    const {roomId} = req.params
    const chatObj = await db.collection('chats').findOne({roomName:roomId})
    const chats = chatObj.chats
    res.send({chatArray:chats})
  }
  catch(e){
    console.log(e)
    res.status(400).send({chatArray:[]})
  }
})

app.delete('/removeNote',async(req,res,next) => {
  try{
    const {id} = req.body
    console.log(new ObjectId(id))
    const feed = await db.collection('notifications').deleteOne({_id:new ObjectId(id)})
    console.log(feed)
    res.status(200).send({data:'Deleted Successfuly'})
  }catch(e) {
    console.log(e)
    res.status(400).send({data:"Something went wrong.."})
  }
})


app.get('/connectedUsers/:username',async(req,res,next) => {
  try{
    const {username} = req.params
    console.log(username)
    const data = await db.collection('chat_ids').findOne({user:username})
    console.log(data)
    if(data !== null){
      res.send({chats:data.chats})
    }else{
      res.send({chats:[]})
    }
  }catch(e){
    console.log(e)
    res.status(400).send({data:'Something went wrong...'})
  }
})

app.post('/addOffer/',async(req,res,next) => {
  try{
    console.log(req.body)
    let jwt_token;
    const authHeader = req.headers['authorization']
    if(authHeader !== undefined){
      jwt_token = authHeader.split(" ")[1]
    }
    if(jwt_token === undefined){
      res.status(401).send({data:'Not Authorized Yet to add offer.'})
    }else{
      jwt.verify(jwt_token,'Secret Token',async(error,payload) => {
        if(error){
          res.status(401).send({data:'Not Authorized Yet to add offer.'})
        }else{
          // console.log(payload)
          const {username} = payload
          const {amount,plan,expiry,devicesIncluded,devicesLookingFor,platform,imgUrl} = req.body
          const feed = await db.collection('app_data').insertOne({app_name:platform,price:amount,plan_type:plan,offered_user:username,img_url:imgUrl,expiry_date:expiry,devicesIncluded,devicesLookingFor})
          console.log(feed)
          res.status(200).send({data:'Offer Added Successfully.'})
        }
      })
    }
  }
  catch(e){
    console.error(e)
    res.status(400).send({data:'Something went wrong , Please Try Again.'})
  }
})

app.delete('/deleteOffer/:offerId',async(req,res,next) => {
  const {offerId} = req.params
  const feed = await db.collection('app_data').deleteOne({_id:new ObjectId(offerId)})
  if(feed.acknowledged){
    res.status(200).send({data:'Deleted Successfully...'})
  }else{
    res.status(400).send({data:'Error Occured'})
  }
})

async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    server.listen(process.env.PORT)
    console.log("Server is running")
    
  }catch(e){
    console.error(e)
  }
}
run()


