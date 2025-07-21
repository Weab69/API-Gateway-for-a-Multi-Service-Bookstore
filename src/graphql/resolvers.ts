import axios from "axios";
import DataLoader from "dataloader";

const reviewLoader = new DataLoader<string, any[]>(async (isbns: readonly string[]): Promise<(any[] | Error)[]> => {
    return Promise.all(isbns.map(async (isbn) => {
        try {
            const reviewsRes = await axios.get<any[]>(`http://localhost:8000/books/${isbn}/reviews`);
            return reviewsRes.data;
        } catch (error: any) {
            console.error(`Failed to fetch reviews for ISBN ${isbn}:`, error);
            // If the error is a 404, it means no reviews were found, which is not a failure.
            if (error.response && error.response.status === 404) {
                return [];
            }
            // For all other errors, return an empty array so that the query doesn't fail.
            return [];
        }
    }));
});

export const resolvers = {
    Query: {
        book: async (_: any, { isbn }: { isbn: string }) => {
            try {
                const bookRes = await axios.get<any[]>(`http://localhost:8000/books/search?q=${isbn}`);
                // The search endpoint returns an array, so we take the first element.
                if (bookRes.data && bookRes.data.length > 0) {
                    return bookRes.data[0];
                }
                return null; // Return null if no book is found
            } catch (error) {
                console.error(`Failed to fetch book for ISBN ${isbn}:`, error);
                // Return null or throw a GraphQL-friendly error
                return null;
            }
        }
    },
    Book: {
        reviews: (book: { isbn: string }) => {
            return reviewLoader.load(book.isbn);
        }
    }
}