export interface OpenLibraryResponse {
    docs: OpenLibraryDoc[];
}

export interface OpenLibraryDoc {
    key: string;
    title: string;
    author_name: string[];
    first_sentence: string[];
    isbn: string[];
    cover_i: number;
}

export interface Book {
    id: string;
    title: string;
    authors: string[];
    description: string;
    isbn: string[];
    cover_image: string;
}
