const { Pool } = require('pg')

const pool = new Pool({
    user: "username",
    password: "password",
    database: "database",
    port: 5432,
    host: "hostname",
    ssl: true
}); 
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
