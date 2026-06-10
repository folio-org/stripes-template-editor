import React from 'react';
import Barcode from 'react-barcode';
import HtmlToReact, { Parser } from 'html-to-react';
import DOMPurify from 'dompurify';

const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

const rules = [
  {
    replaceChildren: true,
    shouldProcessNode: node => node.name === 'barcode',
    processNode: (node, [previewValue]) => <Barcode value={previewValue ? previewValue.trim() : ' '} />,
  },
  {
    shouldProcessNode: () => true,
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

const parser = new Parser();

/**
 * buildPreviewContent
 * Sanitize an HTML string and turn it into React nodes, applying the
 * <barcode> handling the preview has always used. Shared by the regex
 * preview and the backend-rendered preview so both display identically.
 *
 * @argument {string} html
 * @returns {ReactNode}
 */
const buildPreviewContent = (html = '') => {
  const sanitized = DOMPurify.sanitize(html, { ADD_TAGS: ['Barcode'] });

  return parser.parseWithInstructions(sanitized, () => true, rules);
};

export default buildPreviewContent;
