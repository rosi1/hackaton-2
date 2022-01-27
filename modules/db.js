const knex = require('knex');
const pass = require('p4ssw0rd')
const env = require('dotenv');
env.config();

const db = knex({
  client:'pg',
  connection:{
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }
})


const addUser = (obj) => {
  let newobj = {...obj, password:pass.hash(obj.password)}
  console.log('newobj:' ,newobj)
  return db('accounts')
    .insert(newobj)
    .returning('*')
}

const userExist=(username) =>{
    return db('accounts')
    .select('username')
    .where({username})
}

const checkUser = (username,password) =>{
    return db('accounts')
    .select('username' ,'password')
    .where({username})
}


module.exports = {
  addUser,
  userExist,
  checkUser
}