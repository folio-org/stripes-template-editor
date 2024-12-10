import DOMPurify from 'dompurify';

export const SANITIZE_CONFIG = { ADD_TAGS: ['Barcode'], ADD_ATTR: ['target', 'rel'] };

export const sanitize = (value, config = SANITIZE_CONFIG) => {
  // since DOMPurify has a known issue of reversing the order of attributes in perfectly admissible HTML
  // we check to see if the value was affected - and if not, we just return the unaffected value.
  let resultValue = DOMPurify.sanitize(value, config);
  if (value !== resultValue) {
    const removed = DOMPurify.removed.map((item) => item.attribute?.name || item.element?.outerHTML);
    if (removed && removed.length === 0) {
      resultValue = value;
    }
  }
  return resultValue;
};
