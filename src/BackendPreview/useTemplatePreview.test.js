import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import useTemplatePreview from './useTemplatePreview';

// The error test makes react-query log an expected rejection.
setLogger({ log: jest.fn(), warn: jest.fn(), error: jest.fn() });

const mockPost = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: () => ({ post: mockPost }),
}));

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const renderTemplatePreview = (props) => renderHook(
  () => useTemplatePreview(props),
  { wrapper },
);

describe('useTemplatePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts body + context to the preview endpoint when enabled', async () => {
    mockPost.mockReturnValue({ json: () => Promise.resolve({ body: '<p>x</p>' }) });

    const { result } = renderTemplatePreview({ templateBody: 'Body', context: { a: 1 }, enabled: true });

    await waitFor(() => expect(result.current.data).toEqual({ body: '<p>x</p>' }));
    expect(mockPost).toHaveBeenCalledWith('template-request/preview', {
      json: { body: 'Body', context: { a: 1 } },
    });
  });

  it('defaults body and context when omitted', async () => {
    mockPost.mockReturnValue({ json: () => Promise.resolve({ body: 'ok' }) });

    const { result } = renderTemplatePreview({ enabled: true });

    await waitFor(() => expect(result.current.data).toEqual({ body: 'ok' }));
    expect(mockPost).toHaveBeenCalledWith('template-request/preview', {
      json: { body: '', context: {} },
    });
  });

  it('sends header only when a subject is given', async () => {
    mockPost.mockReturnValue({ json: () => Promise.resolve({ header: 'Subject', body: 'ok' }) });

    const { result } = renderTemplatePreview({ templateBody: 'Body', templateSubject: 'Subject', enabled: true });

    await waitFor(() => expect(result.current.data).toEqual({ header: 'Subject', body: 'ok' }));
    expect(mockPost).toHaveBeenCalledWith('template-request/preview', {
      json: { body: 'Body', context: {}, header: 'Subject' },
    });
  });

  it('sends an empty header for an empty subject', async () => {
    mockPost.mockReturnValue({ json: () => Promise.resolve({ header: '', body: 'ok' }) });

    renderTemplatePreview({ templateBody: 'Body', templateSubject: '', enabled: true });

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('template-request/preview', {
      json: { body: 'Body', context: {}, header: '' },
    }));
  });

  it('does not call the backend when disabled', () => {
    renderTemplatePreview({ templateBody: 'Body', context: {}, enabled: false });

    expect(mockPost).not.toHaveBeenCalled();
  });

  it('attaches the extracted backend detail to the error', async () => {
    const body = ['Failed to process template', 'Hallo {{name}}}', '        ^'].join('\n');
    const err = new Error('Request failed');

    err.response = { text: () => Promise.resolve(body) };
    mockPost.mockReturnValue({ json: () => Promise.reject(err) });

    const { result } = renderTemplatePreview({ templateBody: 'Hallo {{name}}}', enabled: true });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.previewError).toEqual({
      message: 'Failed to process template',
      excerpt: 'Hallo {{name}}}\n        ^',
    });
  });
});
