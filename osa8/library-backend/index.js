const { ApolloServer, AuthenticationError, UserInputError, gql, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/Author')
const User = require('./models/User')
const config = require('./utils/config')

mongoose.set('useFindAndModify', false)


console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
  }
  type Author {
    name: String!
    born: Int
  }
  type Query {
    me: User
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User,
    login(
      username: String!
      password: String!
    ): Token,
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book,
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
  type Subscription {
    bookAdded: Book!
  }
`

const pubsub = new PubSub()

const createUser = (root, args) => {
  const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  try {
    user.save()
    console.log(user)
  } catch (error) {
    throw new UserInputError(error.message, { invalidArgs: args })
  } return user
}

const login = async (root, args) => {
  const user = await User.findOne({ username: args.username })

  if ( !user || args.password !== config.PASSWORD ) {
    throw new UserInputError('wrong credentials')
  }

  const userForToken = { username: user.username, id: user._id }

  return { value: jwt.sign(userForToken, config.SECRET) }
}

const allBooks = (root, args) => {
  //const authorFilter = !args.author ? x => true : b => b.author === args.author
  if (args.genre !== undefined) {
    return Book.find({ genres: args.genre }).populate('author')
  }

  return Book.find({}).populate('author')
}

const allAuthors = () => {
  return Author.find({})
}

const addAuthorForBook = async authorName => {
  const author = new Author({ name: authorName })
  try {
    await author.save()
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: { authorName }
    })
  }
}


const addBook = async (root, args, context) => {
  if (!context.currentUser) throw new AuthenticationError("not authenticated")

  const checkAuthor = await Author.findOne({ name: args.author })
  if (!checkAuthor) {
    await addAuthorForBook(args.author)
  }
  const author = await Author.findOne({ name: args.author })

  const book = new Book({ ...args, author: author._id })
  try {
    await book.save()
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
  pubsub.publish('BOOK_ADDED', { bookAdded: book })

  return book
}

const editAuthor = (root, args, context) => {
  if (!context.currentUser) throw new AuthenticationError("not authenticated")

  return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
}


const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allBooks: allBooks,
    allAuthors: allAuthors
  },
  Mutation: {
    createUser: createUser,
    login: login,
    addBook: addBook,
    editAuthor: editAuthor
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
