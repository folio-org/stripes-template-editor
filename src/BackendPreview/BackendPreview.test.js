import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import BackendPreview from './BackendPreview';

const mockHasInterface = jest.fn();
const mockPost = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  useStripes: () => ({ hasInterface: mockHasInterface }),
  useOkapiKy: () => ({ post: mockPost }),
}));

jest.mock('@folio/stripes/components', () => ({
  Loading: () => <div>Loading</div>,
}));

const fallback = <div>REGEX-FALLBACK</div>;

const renderBackendPreview = (props = {}) => render(
  <BackendPreview
    templateBody="Hello {{name}}"
    context={{ name: 'Alex' }}
    fallback={fallback}
    {...props}
  />
);

describe('BackendPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when the template-engine interface is absent', () => {
    beforeEach(() => {
      mockHasInterface.mockReturnValue(false);
    });

    it('renders the fallback and does not call the backend', () => {
      renderBackendPreview();

      expect(screen.getByText('REGEX-FALLBACK')).toBeInTheDocument();
      expect(mockPost).not.toHaveBeenCalled();
    });
  });

  describe('when the template-engine interface is available', () => {
    beforeEach(() => {
      mockHasInterface.mockReturnValue(true);
    });

    it('sends body + context to the preview endpoint and renders the result', async () => {
      mockPost.mockReturnValue({ json: () => Promise.resolve({ body: '<strong>Rendered body</strong>' }) });

      renderBackendPreview();

      expect(await screen.findByText('Rendered body')).toBeInTheDocument();
      expect(mockPost).toHaveBeenCalledWith('template-request/preview', {
        json: { body: 'Hello {{name}}', context: { name: 'Alex' } },
      });
    });

    it('defaults body and context when the props are omitted', async () => {
      mockPost.mockReturnValue({ json: () => Promise.resolve({ body: 'ok' }) });

      render(<BackendPreview fallback={fallback} />);

      expect(await screen.findByText('ok')).toBeInTheDocument();
      expect(mockPost).toHaveBeenCalledWith('template-request/preview', {
        json: { body: '', context: {} },
      });
    });

    it('shows a loading indicator while the request is pending', () => {
      mockPost.mockReturnValue({ json: () => new Promise(() => {}) });

      renderBackendPreview();

      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows an error message when the backend call fails', async () => {
      mockPost.mockReturnValue({ json: () => Promise.reject(new Error('boom')) });

      renderBackendPreview();

      expect(await screen.findByText('stripes-template-editor.preview.backendError')).toBeInTheDocument();
    });
  });
});
