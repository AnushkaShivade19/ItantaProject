import fetcher from '../../src/utils/fetcher';
import fetch from 'node-fetch';

jest.mock('node-fetch');

describe('fetcher.js utility', () => {
  const mockUrl = 'https://example.com/image.jpg';

  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches placeholder image successfully', async () => {
    const mockResponse = new Response(new Blob(), { status: 200 });
    fetch.mockResolvedValueOnce(mockResponse);

    const result = await fetcher(mockUrl);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toBe(mockResponse);
  });

  test('throws error for failed image fetch', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetcher(mockUrl)).rejects.toThrow('Network error');
  });
});