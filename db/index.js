const { Pool } = require('pg')

const pool = new Pool({
    user: "tygmauqmenvvvc",
    password: "9cc7d79b623fd51ef7f0f9a7d76c010283bb7d7b51494004258ce1e1d49c4bb7",
    database: "de5tbr80r6pvl3",
    port: 5432,
    host: "ec2-54-221-212-126.compute-1.amazonaws.com",
    ssl: true
}); 
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}