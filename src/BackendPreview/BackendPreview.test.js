import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import BackendPreview from './BackendPreview';
import useTemplatePreview from './useTemplatePreview';

const mockHasInterface = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  useStripes: () => ({ hasInterface: mockHasInterface }),
}));

jest.mock('@folio/stripes/components', () => ({
  Loading: () => <div>Loading</div>,
}));

jest.mock('./useTemplatePreview');

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
    useTemplatePreview.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });

  describe('when the template-engine interface is absent', () => {
    beforeEach(() => {
      mockHasInterface.mockReturnValue(undefined);
    });

    it('renders the fallback and disables the request', () => {
      renderBackendPreview();

      expect(screen.getByText('REGEX-FALLBACK')).toBeInTheDocument();
      expect(useTemplatePreview).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });

  describe('when the template-engine interface is available', () => {
    beforeEach(() => {
      mockHasInterface.mockReturnValue('2.3');
    });

    it('renders the backend-rendered body and enables the request with body + context', () => {
      useTemplatePreview.mockReturnValue({
        data: { body: '<strong>Rendered body</strong>' },
        isLoading: false,
        isError: false,
      });

      renderBackendPreview();

      expect(screen.getByText('Rendered body')).toBeInTheDocument();
      expect(useTemplatePreview).toHaveBeenCalledWith(
        expect.objectContaining({
          templateBody: 'Hello {{name}}',
          context: { name: 'Alex' },
          enabled: true,
        }),
      );
    });

    it('shows a loading indicator while the request is pending', () => {
      useTemplatePreview.mockReturnValue({ data: undefined, isLoading: true, isError: false });

      renderBackendPreview();

      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows the generic message when the request fails without readable detail', () => {
      useTemplatePreview.mockReturnValue({ data: undefined, isLoading: false, isError: true });

      renderBackendPreview();

      expect(screen.getByText('stripes-template-editor.preview.backendError')).toBeInTheDocument();
    });

    it('shows the backend diagnostic and the caret excerpt when the response carries them', () => {
      useTemplatePreview.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: {
          previewError: {
            message: "found: '}}}', expected: '}}'",
            excerpt: 'Hallo {{user.name}}}\n                 ^',
          },
        },
      });

      renderBackendPreview();

      expect(screen.getByText('stripes-template-editor.preview.backendError')).toBeInTheDocument();
      expect(screen.getByText(/found: '}}}', expected: '}}'/)).toBeInTheDocument();
      expect(screen.getByText(/Hallo {{user\.name}}}/)).toBeInTheDocument();
    });

    it('shows the diagnostic without an excerpt when there is no caret line', () => {
      useTemplatePreview.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: {
          previewError: {
            message: "Failed to close 'user.name' tag @[null:1]",
            excerpt: null,
          },
        },
      });

      renderBackendPreview();

      expect(screen.getByText("Failed to close 'user.name' tag @[null:1]")).toBeInTheDocument();
    });
  });
});
