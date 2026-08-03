import {
  sanitizePlainText,
} from './sanitizer';

describe('sanitizePlainText', () => {
  it('strips real tags down to their text content', () => {
    expect(sanitizePlainText('some text <strong>bold text</strong> {{item.title}}'))
      .toBe('some text bold text {{item.title}}');
  });

  it('strips real tags/attributes while leaving decoded entity text inert', () => {
    expect(sanitizePlainText('<img src=x onerror=alert(1)>literal</img>')).toBe('literal');
  });
});
