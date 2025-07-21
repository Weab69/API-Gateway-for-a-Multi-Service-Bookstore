import axios from "axios";
import DataLoader from "dataloader";

const reviewLoader = new DataLoader<string, any[]>(async (isbns: readonly string[]): Promise<(any[] | Error)[]> => {
    return Promise.all(isbns.map(async (isbn) => {
        try {
            const reviewsRes = await axios.get<any[]>(`http://localhost:8000/books/${isbn}/reviews`);
            return reviewsRes.data;
        } catch (error) {
            // If the error is a 404, it means no reviews were found, which is not a failure.
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return [];
            }
            // For all other errors, return an Error object to be handled by GraphQL.
            return new Error(`Failed to fetch reviews for ISBN ${isbn}`);
        }
    }));
});

export const resolvers = {
    Query: {
        book: async (_: any, { isbn }: { isbn: string }) => {
            const bookRes = await axios.get(`http://localhost:8000/books/search?q=${isbn}`);
            // The search endpoint returns an array, so we take the first element.
            return bookRes.data[0];
        }
    },
    Book: {
        reviews: (book: { isbn: string }) => {
            return reviewLoader.load(book.isbn);
        }
    }
}