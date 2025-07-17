import axios from 'axios';
import { Book, OpenLibraryDoc, OpenLibraryResponse } from '../types/book.types';

export const searchBooks = async (query: string): Promise<Book[]> => {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_sentence,isbn,cover_i`;

    const response = await axios.get<OpenLibraryResponse>(url);
    const docs: OpenLibraryDoc[] = response.data.docs;

    return docs.map(doc => ({
        id: doc.key,
        title: doc.title,
        authors: doc.author_name || [],
        description: doc.first_sentence ? doc.first_sentence[0] : 'No description available.',
        isbn: doc.isbn || [],
        cover_image: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : 'No cover image available.'
    }));
};
