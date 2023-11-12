const Pool = require('pg').Pool
const pool = new Pool({
    user:'postgres',
    password:'1234',
    host:'81.200.148.149',
    port:4432,
    database:'kurs'
})

module.exports = pool