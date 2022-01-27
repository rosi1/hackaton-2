//imports
const exp = require('express');
const env = require('dotenv');
const axios = require('axios');
const db = require('./modules/db');
const pass = require('p4ssw0rd')


const app = exp();
env.config();

// for post body data
app.use(exp.urlencoded({extended: true}));
app.use(exp.json())

app.use(exp.static(__dirname + '/public'))
//set views
app.set('views','./views')
app.set('view engine','ejs')

app.get('/login',(req, res) => {
  res.render('login')
})

app.get('/register',(req, res) => {
  res.render('register')
})

//rendering all the relevant data to the index
app.get('/',(req, res) => {
  console.log(req.query)
  getData(req.query.city)
  .then((data)=>{
    res.render('index',{
      temp:Math.floor(data.main.temp),
      city:data.name,
      description: data.weather[0].description,
      icon:data.weather[0].icon
    })
  })
})

app.post('/login', (req,res)=>{
  console.log(req.body);
  db.checkUser(req.body.username)
  .then((data)=>{
    if(data.length > 0){
      if (pass.check(req.body.password, data[0].password)) {
        // Passwords match
        res.redirect('/')
      }else{
      res.render('login',{message:'User does not match'})
    }
  }
  })
    .catch(err=>{
      // alert('User does not exist')
      console.log(err)
          res.json({message:'User does not exist'})
        })
  })
  

app.post('/register', (req,res)=>{
  console.log(req.body);
  db.userExist(req.body.username)
  .then((user)=>{
    console.log('user' ,user);
    if(user.length > 0){
      res.json({message:'User already exist!'})
    }else{
      db.addUser(req.body)
        .then(data=>{
          // res.json({message:'OK'});
          res.redirect('/login')
        })
        .catch(err=>{
          console.log(err)
          res.render({message:'not ok'})
        })
    }
  })
  .catch(err=>{
    console.log(err)
  })
  })
 
//fetching the data from the api
const getData = async(city='eilat') =>{
  try{
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`)
      const data = await response.data
      return data
  }
  catch(err){
      console.log(err)
  }
}

// listen to a port
app.listen(process.env.PORT, ()=>{
  console.log(`listening on port ${process.env.PORT}`);
})