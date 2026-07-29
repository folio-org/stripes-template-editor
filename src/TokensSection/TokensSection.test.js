import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import TokensSection from './TokensSection';

const renderTokensSection = (props = {}) => render(
  <TokensSection
    section="item"
    tokens={[
      { token: 'item.title', allowedFor: ['item'] },
      { token: 'item.barcodeImage', allowedFor: ['item'], disabled: false },
    ]}
    onSectionInit={jest.fn()}
    onTokenSelect={jest.fn()}
    {...props}
  />
);

describe('TokensSection', () => {
  it('does not disable tokens by default', () => {
    renderTokensSection();

    expect(screen.getByRole('checkbox', { name: 'item.title' })).not.toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'item.barcodeImage' })).not.toBeDisabled();
  });

  it('disables a token flagged disabled: true, leaving other tokens enabled', () => {
    const tokens = [
      { token: 'item.title', allowedFor: ['item'] },
      { token: 'item.barcodeImage', allowedFor: ['item'], disabled: true },
    ];

    renderTokensSection({ tokens });

    expect(screen.getByRole('checkbox', { name: 'item.title' })).not.toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'item.barcodeImage' })).toBeDisabled();
  });
});
