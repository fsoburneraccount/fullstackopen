const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const config = require('../utils/config')

blogsRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id })

  response.json(comments)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  console.log(body)
  const comment = new Comment({
    comment: body.comment,
    blog: request.params.id
  })

  const savedComment = await comment.save()
  response.status(201).json(savedComment.toJSON())
})


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  if (blog)
    response.json(blog.toJSON())
  else
    response.status(404).end()
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title:  body.title,
    author: body.author,
    url:    body.url,
    likes:  body.likes === undefined ? 0 : body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogId = request.params.id
  const res = await Blog.deleteOne({ _id: blogId, user: decodedToken.id })

  if (res.deletedCount > 0) {
    response.status(204).end()
  } else {
    const errorStr = `No blog with id ${blogId} found for the given user`
    response.status(400).send({ error: errorStr })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  const body = request.body
  const updatedContent = {
    title:  body.title  === undefined ? blog.title  : body.title,
    author: body.author === undefined ? blog.author : body.author,
    url:    body.url    === undefined ? blog.url    : body.url,
    likes:  body.likes  === undefined ? blog.likes  : body.likes,
    user: blog.user
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedContent, { new: true })
  response.status(201).send(updatedBlog)
})


module.exports = blogsRouter

