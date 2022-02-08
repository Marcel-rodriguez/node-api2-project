// implement your server here
// require your posts router and connect it here

const express = require('express')
const postRouter = require('./posts/posts-router')

const server = express()

server.use(express.json())
server.use('/api/posts', postRouter);

//other endpoint

server.get('/', (req, res) => {
    res.send(`
    <h1>It's working!</h1>
    `)
})

module.exports = server