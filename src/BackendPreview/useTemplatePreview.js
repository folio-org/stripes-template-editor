import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import extractBackendError from './extractBackendError';

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

  const { data, isLoading, isError, error } = useQuery(
    ['stripes-template-editor', 'template-preview', templateBody, context],
    async () => {
      try {
        return await ky.post(PREVIEW_PATH, {
          json: {
            body: templateBody || '',
            context: context ?? {},
          },
        }).json();
      } catch (err) {
        // Read here, not in the consumer: response.text() is async.
        err.previewError = await extractBackendError(err);

        throw err;
      }
    },
    { enabled },
  );

  return { data, isLoading, isError, error };
};

export default useTemplatePreview;
