import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import PreviewModal from './PreviewModal';

jest.mock('../BackendPreview', () => () => <div>BACKEND-PREVIEW</div>);

jest.mock('@folio/stripes/components', () => ({
  Modal: ({ children }) => <div>{children}</div>,
  Button: ({ children, onClick }) => <button type="button" onClick={onClick}>{children}</button>,
}));

const baseProps = {
  open: true,
  header: 'Preview',
  previewFormat: { name: 'World' },
  previewTemplate: 'Hello {{name}}',
  onClose: jest.fn(),
};

describe('PreviewModal', () => {
  it('renders the regex-resolved content by default', () => {
    render(<PreviewModal {...baseProps} />);

    expect(screen.getByText('Hello World', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('BACKEND-PREVIEW')).toBeNull();
  });

  it('renders BackendPreview when previewRenderer is "backend" and the modal is open', () => {
    render(<PreviewModal {...baseProps} previewRenderer="backend" previewContext={{}} />);

    expect(screen.getByText('BACKEND-PREVIEW')).toBeInTheDocument();
  });

  it('does not mount BackendPreview while the modal is closed', () => {
    render(<PreviewModal {...baseProps} open={false} previewRenderer="backend" previewContext={{}} />);

    expect(screen.queryByText('BACKEND-PREVIEW')).toBeNull();
  });
});
