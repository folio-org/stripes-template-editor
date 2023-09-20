export default (templateStr) => {
  return (tokensList) => {
    return templateStr.replace(/{{([^{}]*)}}/g, (tag, tokenName) => {
      const tokenValue = tokensList[tokenName];
      return typeof tokenValue === 'string' || typeof tokenValue === 'number' ? tokenValue : '';
    });
  };
};

