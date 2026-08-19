import extractBackendError from './extractBackendError';

// Verbatim backend responses, do not tidy.
const HANDLEBARS_RESPONSE = [
  "Template could not be rendered: Failed to process template: inline@f691f91:1:17: found: '}}}', expected: '}}'",
  'Hallo {{user.name}}} {{order.poNumber}}',
  '                 ^',
].join('\n');

const MUSTACHE_RESPONSE = "Template could not be rendered: Failed to close 'user.name' tag @[null:1]";

const errorWithBody = (body) => ({
  message: 'Request failed',
  response: { text: () => Promise.resolve(body) },
});

describe('extractBackendError', () => {
  it('extracts message and caret excerpt from a handlebars response', async () => {
    const { message, excerpt } = await extractBackendError(errorWithBody(HANDLEBARS_RESPONSE));

    expect(message).toBe(
      "Template could not be rendered: Failed to process template: inline@f691f91:1:17: found: '}}}', expected: '}}'",
    );
    expect(excerpt).toBe('Hallo {{user.name}}} {{order.poNumber}}\n                 ^');
  });

  it('extracts the message alone when the response carries no caret line', async () => {
    const { message, excerpt } = await extractBackendError(errorWithBody(MUSTACHE_RESPONSE));

    expect(message).toBe(MUSTACHE_RESPONSE);
    expect(excerpt).toBeNull();
  });

  it('reads the message from a JSON error body', async () => {
    const body = JSON.stringify({ errors: [{ message: 'Bad template' }] });

    const { message, excerpt } = await extractBackendError(errorWithBody(body));

    expect(message).toBe('Bad template');
    expect(excerpt).toBeNull();
  });

  it('falls back to the error message when the response has no body', async () => {
    const { message, excerpt } = await extractBackendError(errorWithBody(''));

    expect(message).toBe('Request failed');
    expect(excerpt).toBeNull();
  });

  it('falls back to the error message when the body cannot be read', async () => {
    const err = {
      message: 'Request failed',
      response: { text: () => Promise.reject(new Error('unreadable')) },
    };

    const { message, excerpt } = await extractBackendError(err);

    expect(message).toBe('Request failed');
    expect(excerpt).toBeNull();
  });

  it('falls back when the error carries no response at all', async () => {
    const { message, excerpt } = await extractBackendError({ message: 'Network down' });

    expect(message).toBe('Network down');
    expect(excerpt).toBeNull();
  });

  it('trims a long source line around the caret', async () => {
    const body = ['Diagnostic', 'x'.repeat(200), `${' '.repeat(120)}^`].join('\n');

    const { excerpt } = await extractBackendError(errorWithBody(body));

    expect(excerpt).toBe(`…${'x'.repeat(90)}…\n${' '.repeat(46)}^`);
  });

  it('uses the last caret line when the body quotes an earlier one', async () => {
    const body = ['Diagnostic', 'first source', '  ^', 'second source', '      ^'].join('\n');

    const { excerpt } = await extractBackendError(errorWithBody(body));

    expect(excerpt).toBe('second source\n      ^');
  });
});
