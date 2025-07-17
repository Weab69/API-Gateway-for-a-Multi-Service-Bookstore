import request from 'supertest';
import express from 'express';
import bookRoutes from '../../src/modules/books/routes/bookRoutes';
import * as bookService from '../../src/modules/books/services/bookService';

const app = express();
app.use(express.json());
app.use('/books', bookRoutes);

// Mock the service layer to isolate the controller and routes
jest.mock('../../src/modules/books/services/bookService');

const mockedSearchBooks = bookService.searchBooks as jest.Mock;

describe('Feature: GET /books/search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 200 status and a list of books for a valid query', async () => {
    const mockBooks = [
      {
        id: '/works/OL82563W',
        title: "Harry Potter and the Sorcerer's Stone",
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

  it('should return a 400 status if the search query is missing', async () => {
    const response = await request(app).get('/books/search');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Search query is required' });
    expect(mockedSearchBooks).not.toHaveBeenCalled();
  });

  it('should return a 500 status if the book service fails', async () => {
    mockedSearchBooks.mockRejectedValue(new Error('Internal Server Error'));

    const response = await request(app).get('/books/search?q=fail');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching book data' });
  });
});
