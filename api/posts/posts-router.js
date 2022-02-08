// implement your posts router here
const { Router } = require('express')

const postsRouter = Router()
const postModel = require('./posts-model')

postsRouter.get('/', (req, res) => {
    postModel.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    }).catch(err => {
       console.error(err)
       res.status(500).json({message: "Error retrieving the posts"}) 
    })
})

postsRouter.get('/:id', (req, res) => {
    let { id } = req.params
    postModel.findById(id)
    .then(posts => {
        if(posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({message: `post with id ${id} does not exist`})
        }
    }).catch(err => {
        console.error(err)
        res.status(500).json({message: "Error retrieving post"})
    })
})

postsRouter.get('/:id/comments', (req, res) => {
    let { id } = req.params
    postModel.findPostComments(id)
    .then(postComments => {
        console.log(postComments)
        if(postComments.length === 0) {
            res.status(404).json({message: `Comments for post ${id} does not exist`})
        } else {
            res.status(200).json(postComments)
        }

    }).catch(err => {
        console.error(err)
        res.status(500).json({message: "Post does not exist"})
    })
})

postsRouter.post('/:id/comments', (req, res) => {
    let { id } = req.params

    let newComment = {
        text: req.body.text,
        post_id: id
    }

    if(!newComment.text){
        res.status(400).json({message: "Please provide some text to add a new comment!"})
    } else {
        postModel.insertComment(newComment)
    .then(resp => {
        res.status(200).json(newComment)
    }).catch(err => {
        console.error(err)
        res.status(500).json({message: "Failed to add new comment"})
    })
    }
})


postsRouter.post('/', (req, res) => {
    let body = req.body

    if(!body.title || !body.contents){
        res.status(400).json({message: "Error adding post title and contents are required"})
    } else {
        postModel.insert(body)
    .then(post => {
        const newPost = {
            id: post.id,
            title: body.title,
            contents: body.contents
        }
        res.status(201).json(newPost)
    }).catch(err => {
        console.error(err)
        res.status(500).json({message: "Error adding post"})
    })
    }
})


postsRouter.put('/:id', async (req, res) => {
    let { id } = req.params
    try{
        let post = await postModel.findById(id)
        if (post === undefined || post === null){
            res.status(404).json({message: `post ${id} does not exist`})
        }

        let body = req.body
        if(!body.title || !body.contents){
            res.status(400).json({message: "Error modifying post please provide title and contents"})
        } else {
            await postModel.update(id, body)
            const updatedPost = await postModel.findById(id)
            res.status(200).json(updatedPost)
        }
    } catch(e) {
        res.status(500).json({message: "There was an error modifying this post"})
    }
})

postsRouter.delete('/:id', (req, res) => {
    let { id } = req.params;
    // let post = postModel.findById(id)
    postModel.remove(id)
    .then(deletedPost => {
        console.log(deletedPost)

        if(deletedPost === null || deletedPost === undefined){
            res.status(404).json({messsage: `post with id ${id} does not exist !`})
        }

            res.status(200).json(deletedPost)
    }).catch(err => {
        console.error(err)
        res.status(500).json({message: "Failed to delete post!"})
    })
})

module.exports = postsRouter