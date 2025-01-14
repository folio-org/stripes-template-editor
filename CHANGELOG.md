# Change history for stripes-template-editor

## [3.4.2](https://github.com/folio-org/stripes-template-editor/tree/v3.4.2) (2025-01-14)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.4.1...v3.4.2)

* Only change `value` prop to `ReactQuill` if `DOMPurify` made changes. Refs STRIPES-953.
* Export `sanitize` function for module-level value sanitization. Refs STRIPES-953 also.

## [3.4.1](https://github.com/folio-org/stripes-template-editor/tree/v3.4.1) (2024-11-13)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.4.0...v3.4.1)

* Correctly import DOMPurify. Refs STRIPES-947.

## [3.4.0](https://github.com/folio-org/stripes-template-editor/tree/v3.4.0) (2024-10-15)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.3.4...v3.4.0)

* upgrade `react-quill` version to `2.0.0`. Refs STRIPES-896.
* Push template content through DOMPurify to avoid XSS vulnerabilities. Refs STRIPES-908.
* Add a `bound` template option with template ID to fix the overflowing Link tooltip issue. Refs STRIPES-918.
* Sanitize template string before passing it to the editor component. Refs STRIPES-933.

## [3.3.4](https://github.com/folio-org/stripes-template-editor/tree/v3.3.4) (2024-10-01)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.3.3...v3.3.4)

* Sanitize template string before passing it to the editor component. Refs STRIPES-933.

## [3.3.3](https://github.com/folio-org/stripes-template-editor/tree/v3.3.3) (2024-04-01)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.3.2...v3.3.3)

* Specifically permit `<Barcode>`; otherwise dompurify will strip it as an unknown tag. Refs STRIPES-908.

## [3.3.2](https://github.com/folio-org/stripes-template-editor/tree/v3.3.2) (2024-03-25)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.3.1...v3.3.2)

* Push template content through DOMPurify to avoid XSS vulnerabilities. Refs STRIPES-908.

## [3.3.1](https://github.com/folio-org/stripes-template-editor/tree/v3.3.1) (2023-11-08)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.3.0...v3.3.1)

* upgrade `react-quill` version to `2.0.0`. Refs STRIPES-896.

## [3.3.0](https://github.com/folio-org/stripes-template-editor/tree/v3.2.0) (2023-10-13)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.2.0...v3.3.0)

* Should have possible handle disabled state for loop by passed function. Refs STRIPES-856.
* Bump Node.js to v18 in CI. Refs STRIPES-887.
* Support React v18. Refs STRIPES-886.
* Support react-intl v6. Refs STRIPES-885.

## [3.2.0](https://github.com/folio-org/stripes-template-editor/tree/v3.2.0) (2023-03-03)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.1.1...v3.2.0)

* Provide `@folio/stripes` `v8` compatibility. Refs STRIPES-849.

## [3.1.1](https://github.com/folio-org/stripes-template-editor/tree/v3.1.1) (2022-11-14)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.0.1...v3.1.1)

* Prefix UUIDs used for HTML `id` attributes to guarantee a non-numeric-prefix. Refs STRIPES-832.

## [3.1.0](https://github.com/folio-org/stripes-template-editor/tree/v3.1.0) (2022-10-25)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v3.0.0...v3.1.0)

* Correctly display numbers. Refs FOLIO-3250.
* Provide missing `aria-label` attribute to tokens button. Refs UICIRC-428.
* Correctly format `ol`/`ul` values. Refs STRIPES-810.
* use tab key to create indented lists. Refs UINOTES-134.
* Provide `@folio/stripes` `v7` compatibility alongside `v6`. Refs STRIPES-827.
* Use a unique DOM `id` per editor, allowing multiple editors simultaneously.

## [3.0.0](https://github.com/folio-org/stripes-template-editor/tree/v3.0.0) (2021-01-26)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v2.0.0...v3.0.0)

* *BREAKING* `@folio/stripes` `v6` compatibility

## [2.0.0](https://github.com/folio-org/stripes-template-editor/tree/v2.0.0) (2020-10-19)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v1.0.2...v2.0.0)

* *BREAKING* increment @folio/stripes to v5 (#12)

## [1.0.2](https://github.com/folio-org/stripes-template-editor/tree/v1.0.2) (2020-09-25)
[Full Changelog](https://github.com/folio-org/stripes-template-editor/compare/v1.0.0...v1.0.2)
