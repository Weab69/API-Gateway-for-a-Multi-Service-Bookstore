import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type Query {
        book(isbn: String!): Book
    }

    type Book {
        title: String
        authors: [String]
        description: String
        reviews: [Review]
    }
    
    type Review {
        user: String
        rating: Int
        comment: String
    }
`;