const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { GraphQLError } = require('graphql')

const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()




const resolvers = {
    Query: {
        bookCount: async () => Book.countDocuments(),
        authorCount: async () => Author.countDocuments(),
        allAuthors: async (root, args) => { return Author.find({}).populate("books") },

        allBooks: async (root, args) => {
            const authorToFetch = await Author.findOne({ name: args.author })
            console.log(await Book.find({}).populate("author"))
            if (args.author && args.genre) {
                return await Book.find({ author: authorToFetch.id, genres: { $in: args.genre } }).populate('author')
            } else if (args.author) {
                return await Book.find({ author: authorToFetch.id, }).populate('author')
            } else if (args.genre) {
                return await Book.find({ genres: { $in: args.genre }, }).populate('author')
            }
            return await Book.find({}).populate("author")
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },

    Author: {
        bookCount: async (root) => {
            const authorToFetch = await Author.findOne({ name: root.name })
            const booksToFetch = await Book.find({ author: authorToFetch.id }).countDocuments()
            return booksToFetch
        }
    }
    , Mutation: {
        editAuthor: async (root, args, context) => {
            const authorToUpdate = await Author.findOne({ name: args.name })
            console.log(context)

            if (!context.currentUser) {
                throw new GraphQLError("no authorization", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    }
                })
            }
            if (!authorToUpdate) {
                return null
            }
            authorToUpdate.born = args.born
            try {
                await authorToUpdate.save()
            } catch (error) {
                throw new GraphQLError("Author edit failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: authorToUpdate,
                        error
                    }
                })
            }
            return authorToUpdate
        },
        addBook: async (root, args, context) => {
            const authorToFetch = await Author.findOne({ name: args.author })
            const bookToFetch = await Book.findOne({ title: args.title })

            if (!context.currentUser) {
                throw new GraphQLError("no authorization", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    }
                })
            }

            if (bookToFetch) {
                throw new GraphQLError("Book already exists", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.title,
                    },
                })
            }

            if (!authorToFetch) {
                const authorToAdd = new Author({ name: args.author })
                try {
                    await authorToAdd.save()
                } catch (error) {
                    throw new GraphQLError("Adding new book failed"), {
                        extensions: {
                            code: `BAD_USER_INPUT`,
                            invalidArgs: args.title,
                            error,
                        }
                    }
                }
            }
            const bookAuthor = await Author.findOne({ name: args.author })
            const bookToAdd = new Book({ ...args, author: bookAuthor })
            try {
                await bookToAdd.save()
            } catch (error) {
                throw new GraphQLError("Failed to save book", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                        error
                    }
                })
            }
            pubsub.publish("BOOK_ADDED", { bookAdded: bookToAdd })
            return bookToAdd
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username })
            try {
                await user.save()
            } catch (error) {
                throw new GraphQLError("User creation failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.username,
                        error
                    }
                })
            }

            return (user)
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'password') {
                throw new GraphQLError('incorrect credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            }
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator(["BOOK_ADDED"]),
        },

    }
}
module.exports = resolvers