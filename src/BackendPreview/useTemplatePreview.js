import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const PREVIEW_PATH = 'template-request/preview';

/**
 * useTemplatePreview
 * Renders a template body through mod-template-engine
 * (POST /template-request/preview). The TemplateEditor edits a single
 * field (the body), so only { body, context } is sent.
 *
 * `enabled` gates the request on the template-engine interface being
 * present, so the caller can fall back to the regex preview when it is not.
 */
const useTemplatePreview = ({ templateBody, context, enabled }) => {
  const ky = useOkapiKy();

  const { data, isLoading, isError } = useQuery(
    ['stripes-template-editor', 'template-preview', templateBody, context],
    () => ky.post(PREVIEW_PATH, {
      json: {
        body: templateBody || '',
        context: context ?? {},
      },
    }).json(),
    { enabled },
  );

  return { data, isLoading, isError };
};

export default useTemplatePreview;
