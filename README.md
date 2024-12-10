# stripes-template-editor

Copyright (C) 2017-2020 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is a NPM module to aid with embedding the Quill editor in [Stripes](https://github.com/folio-org/stripes-core/) applications for building templates with token substitution.


## Value Sanitization

In any case where a user-created HTML string will be rendered directly to the UI, it should be sanitized to eliminate any issues with malformed tags/attributes. This library exports a `sanitize` function that should be used within the ui-module prior to passing the value to the form. The function accepts the value to be rendered and an optional overriding configuration for the sanitization library.

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


## Attribution

@skomorokh extracted this from ui-circulation in [this commit](https://github.com/folio-org/ui-circulation/commit/ead94d580d7e0be4e8b9f17d9fc99a2e43fb8cae). The code was largely written by @maximdidenkoepam and @skomorokh probably should have made more of an effort to bring the commit history along. However, you can view it at the originating module.

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
