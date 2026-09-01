# stripes-template-editor

Copyright (C) 2017-2020 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is a NPM module to aid with embedding the Quill editor in [Stripes](https://github.com/folio-org/stripes-core/) applications for building templates with token substitution.


## Value Sanitization

In any case where a user-created HTML string will be rendered directly to the UI, it should be sanitized to eliminate any issues with malformed tags/attributes. This library exports a `sanitize` function that should be used within the ui-module prior to passing the value to the form. The function accepts the value to be rendered and an optional overriding configuration for the sanitization library. It will return the sanitized string if any removals were necessary, otherwise it will return the original parameter value.

```
import { sanitize,  TemplateEditor } from '@folio/stripes-template-editor'


const value = persistedValue // value obtained from backend...

const appliedValue = sanitize(value);

<Form initialValues={{ template: appliedValue }}>
  <Field component="TemplateEditor">
</Form>


```

If the sanitization needs to be adjusted for specific use-cases, it can be imported and extended...

```
import { SANITIZE_CONFIG } from '@folio/stripes-template-editor`;

const localConfig = { ...SANITIZE_CONFIG, ...MY_CONFIG, };

const appliedValue = sanitize(value, localConfig);

```

For the configuration possibilities, reference the [`DOMPurify` configuration details](https://github.com/cure53/DOMPurify?tab=readme-ov-file#can-i-configure-dompurify) if needed!


## Backend-rendered preview (opt-in)

By default the preview resolves tokens with a flat regex substitution
(`{{token}}` &rarr; value). It cannot evaluate Mustache sections, loops or
conditionals, so for templates that use them the preview does not match the
output `mod-template-engine` produces for the real message.

A consumer can opt in to a preview rendered by `mod-template-engine` itself, so
the preview becomes a true single source of truth:

```jsx
import { SAMPLE_CONTEXT } from './sampleContext';

<Field
  name="localizedTemplates.en.body"
  component={TemplateEditor}
  previewModalHeader={<FormattedMessage id="ui-foo.previewHeader" />}
  previewRenderer="backend"
  previewContext={SAMPLE_CONTEXT}
  tokens={TOKENS}
  tokensList={TokensList}
/>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `previewRenderer` | `'regex' \| 'backend'` | `'regex'` | Selects the preview renderer. `'regex'` keeps the existing behaviour. |
| `previewContext` | `object` | &ndash; | Sample context passed to the backend. Used only when `previewRenderer="backend"`. |

The editor edits a single field (the body), so backend mode sends
`{ body, context }` to `POST /template-request/preview` and shows the rendered
body. `header`/`body`/`context` are all optional on that endpoint.

### Requirements for consumers

* The tenant must run `mod-template-engine` providing the `template-engine`
  interface `2.3` or later (the non-persisted `/template-request/preview`
  endpoint). The backend call is guarded by a `template-engine` interface
  check (`stripes.hasInterface`): if the interface is absent, the preview
  falls back to the regex renderer &mdash; no error, no 404. The interface is
  declared in this library's `optionalOkapiInterfaces`, so tenants without
  `mod-template-engine` are unaffected.
* The consuming app must request the `template-request.preview.post` permission
  in its `package.json`.

When the backend rejects a template, the preview shows the diagnostic it returned
below the generic message, followed by a short excerpt with a caret where the
response points at a position. How much detail arrives depends on the template
resolver; if none can be extracted, the generic message is shown on its own.

### Sample context shape

The context mirrors the nested object the backend builds for the real message
(not a flat token map). Tokens like `{{organization.name}}` and loops like
`{{#orders}}…{{/orders}}` resolve against it:

```js
export const SAMPLE_CONTEXT = {
  organization: {
    name: 'Example Vendor',
    primaryAddress: { city: 'Berlin', country: 'Germany' },
  },
  orders: [
    {
      order: { poNumber: '10037' },
      orderLines: [
        { orderLine: { title: 'Introduction to Library Science', quantity: 2 } },
      ],
    },
  ],
};
```

The rendered HTML is sanitized before display, the same as the regex preview.


## Attribution

@skomorokh extracted this from ui-circulation in [this commit](https://github.com/folio-org/ui-circulation/commit/ead94d580d7e0be4e8b9f17d9fc99a2e43fb8cae). The code was largely written by @maximdidenkoepam and @skomorokh probably should have made more of an effort to bring the commit history along. However, you can view it at the originating module.

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
