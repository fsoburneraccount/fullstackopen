const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const config = require('../utils/config')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token = ''
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(config.TESTUSER_PASS, saltRounds)

  const user = new User({
    userName: 'testuser',
    name: 'Mr. Test',
    passwordHash: passwordHash,
    blogs: []
  })

  const savedUser = await user.save()
  const initialBlogsWithUser = helper.initialBlogs.map(b => ({ ...b, user: savedUser.id }))

  const login = await api
    .post('/api/login')
    .send({ userName: 'testuser', password: config.TESTUSER_PASS})
  token = login.body.token

  await Blog.insertMany(initialBlogsWithUser)
})

describe('get', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('React patterns')
  })

  test('all blogs contain field \'id\'', async () => {
    const response = await api.get('/api/blogs')

    response.body.map(b => expect(b.id).toBeDefined())
  })
})

describe('post', () => {
  test('a valid blog cannot be added without a token ', async () => {
    const newBlog = {
      title: 'This is a test',
      author: 'Author of these tests',
      url: 'fullstackopen.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'This is a test',
      author: 'Author of these tests',
      url: 'fullstackopen.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('This is a test')
  })

  test('if a blog is added without likes, it is set to 0', async () => {
    const newBlog = {
      title: 'This is also a test',
      author: 'Author of these tests',
      url: 'fullstackopen.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const likes = blogsAtEnd.map(b => ({ title: b.title, likes: b.likes }))
    expect(likes).toContainEqual({ title: 'This is also a test', likes: 0 })
  })

  test('if a blog is added without title, an error is returned', async () => {
    const noTitle = {
      author: 'Author of these tests',
      url: 'fullstackopen.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(noTitle)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)

    const noUrl = {
      title: 'This is a test as well',
      author: 'Author of these tests',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(noUrl)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('delete', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContainEqual(blogToDelete)
  })
})

describe('put', () => {
  test('a blog can be edited', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]
    const editedBlog = {
      title:  blogToEdit.title,
      author: blogToEdit.author,
      url:    blogToEdit.url,
      likes:  blogToEdit.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(editedBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    const idsAndLikesAtEnd = blogsAtEnd.map(x => ({ id: x.id, likes: x.likes }))

    expect(idsAndLikesAtEnd).not.toContainEqual({ id: blogToEdit.id, likes: blogToEdit.likes })
    expect(idsAndLikesAtEnd).toContainEqual({ id: blogToEdit.id, likes: editedBlog.likes })
  })
})


afterAll(() => mongoose.connection.close())

