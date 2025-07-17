import request from 'supertest';
import express from 'express';
import bookRoutes from '../../src/modules/books/routes/bookRoutes';
import * as bookService from '../../src/modules/books/services/bookService';

const app = express();
app.use('/books', bookRoutes);

jest.mock('../../src/modules/books/services/bookService');

const mockedSearchBooks = bookService.searchBooks as jest.Mock;

describe('GET /books/search', () => {
  it('should return a list of books when searching with a valid query', async () => {
    const mockBooks = [
      {
        id: '/works/OL82563W',
        title: 'Harry Potter and the Sorcerer\'s Stone',
        authors: ['J.K. Rowling'],
        description: 'A summary of the book.',
        isbn: ['9780590353427'],
        cover_image: 'http://covers.openlibrary.org/b/id/12345-L.jpg',
      },
    ];

    mockedSearchBooks.mockResolvedValue(mockBooks);

    const response = await request(app).get('/books/search?q=harry+potter');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBooks);
    expect(mockedSearchBooks).toHaveBeenCalledWith('harry potter');
  });

  it('should return a 400 error if the search query is missing', async () => {
    const response = await request(app).get('/books/search');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Search query is required' });
  });

  it('should return a 500 error if the service throws an error', async () => {
    mockedSearchBooks.mockRejectedValue(new Error('Service Error'));

    const response = await request(app).get('/books/search?q=error');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching book data' });
  });
});
