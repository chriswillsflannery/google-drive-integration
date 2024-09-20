import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from './App';

// mock fetch globally
global.fetch = vi.fn()

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    })

    it('not authenticated -> render button', async() => {
        global.fetch.mockResolvedValueOnce({
            ok: false
        })

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Authenticate with Google')).toBeDefined()
        });
    })

    it('authenticated -> render file list', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: '1', name: 'test.txt', mimeType: 'text/plain', modifiedTime: new Date().toISOString() }]),
          });
      
          render(<App />);
          
          await waitFor(() => {
            expect(screen.getByText('Your Files:')).toBeDefined();
          });
    });
})