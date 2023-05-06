require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcrypt')
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express()

app.use(express.json())


const db = client.db("AppSubscriptor")

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3004");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});



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
            const jwt_token = jwt.sign(payload,`Secret Token of ${user}`)
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
    const {user,password,age,mobile} = req.body
    console.log(user,password,age,mobile)
    const db_user = await db.collection('user_data').findOne({"username":user})
    console.log(db_user)

    if(db_user === null){
      const hashed_password = await bcrypt.hash(password,10)
      const feed = await db.collection('user_data').insertOne({username:user,password:hashed_password,age:age,mobile:mobile})
      console.log(feed)
      // res.status(200).send(feed)
      const payload = {
              username:user
            }
      const jwt_token = jwt.sign(payload,`Secret Token of ${user}`)
      res.send({jwt_token})
    }else{
      res.send({error:'Username is already in use'})
      res.status(400)
    }
    // console.log(params.details)
    
    

  }catch(e){
    console.error(e)
  }
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.listen(process.env.PORT)
    console.log("Server is running")
    
  }catch(e){
    console.error(e)
  }
}
run()


