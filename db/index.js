const { Pool } = require('pg')

const pool = new Pool({
    user: "dbaybxtynyshgf",
    password: "2efe491307c4c9b6275eb7cedd285b79508d265c25ac9dcbb954713424ca404a",
    database: "dnvirmkujfnvj",
    port: 5432,
    host: "ec2-184-72-238-22.compute-1.amazonaws.com",
    ssl: true
}); 
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}