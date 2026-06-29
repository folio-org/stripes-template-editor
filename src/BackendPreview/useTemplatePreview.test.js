import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import useTemplatePreview from './useTemplatePreview';

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

  it('does not call the backend when disabled', () => {
    renderTemplatePreview({ templateBody: 'Body', context: {}, enabled: false });

    expect(mockPost).not.toHaveBeenCalled();
  });
});
