/**
 * templateResolver
 * given a string containing placeholders like {{foo}}, return a function
 * that takes a map of key-value pairs and replaces the placeholders
 * in the template-string with values from the map if they are strings
 * or numbers; placeholders without a corresponding key and keys with
 * other types of values are replaced with an empty string.
 *
 * @argument {string} templateStr
 * @returns {function} that takes a map and returns a strng
 */
export default (templateStr) => {
  return (tokensList) => {
    return templateStr.replace(/{{([^{}]*)}}/g, (_tag, tokenName) => {
      const tokenValue = tokensList[tokenName];
      return typeof tokenValue === 'string' || typeof tokenValue === 'number' ? tokenValue : '';
    });
  };
};
