const typeDefs = `
type User {
    username: String!
    favouriteGenre: String!
    id: ID!
}
type Token {
    value: String!
}
type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int
} 
type Book {
    title: String!
    published: String!
    author: Author!
    id: ID!
    genres:[String!]!
}
type Query {
    bookCount :Int!
    authorCount:Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
}
type Mutation {
    editAuthor(
        name: String!
        born: String!
    ) :Author
    addBook(
        title: String!
        author: String!
        published: String!
        genres: [String!]
    ) :Book

createUser(
    username: String!
    favouriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
}

type Subscription {
    bookAdded: Book!
}
`

module.exports = typeDefs