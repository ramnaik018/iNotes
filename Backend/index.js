const express = require('express')
var cors = require('cors')
const dotenv =  require('dotenv')

dotenv.config()

const connectToMongo = require("./db")

const app = express()
const port = process.env.PORT || 5000
connectToMongo();

app.use(cors())
app.use(express.json())

//Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/', (req, res) => {
  res.status(404).json({
      message: 'Working!',
      success:true
  });
});

app.get('*', (req, res) => {
  res.status(404).json({
      message: 'Page Not Found',
      success:false
  });
});

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

