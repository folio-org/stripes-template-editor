import { render } from '@folio/jest-config-stripes/testing-library/react';

import buildPreviewContent from './previewContent';

describe('buildPreviewContent', () => {
  it('renders HTML as React nodes', () => {
    const { container, queryByText } = render(<div>{buildPreviewContent('<strong>Hello</strong> world')}</div>);

    expect(container.querySelector('strong')).not.toBeNull();
    expect(queryByText('Hello', { exact: false })).not.toBeNull();
  });

  it('sanitizes dangerous markup', () => {
    const { container } = render(<div>{buildPreviewContent('<script>alert(1)</script>safe')}</div>);

    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('safe');
  });

  it('renders a <barcode> tag as a Barcode component', () => {
    const { container } = render(<div>{buildPreviewContent('<barcode>12345</barcode>')}</div>);

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders a <barcode> tag with a fallback value when empty', () => {
    const { container } = render(<div>{buildPreviewContent('<barcode></barcode>')}</div>);

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('handles empty input without throwing', () => {
    expect(() => render(<div>{buildPreviewContent('')}</div>)).not.toThrow();
  });
});
