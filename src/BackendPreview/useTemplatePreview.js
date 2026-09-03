import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import extractBackendError from './extractBackendError';

const PREVIEW_PATH = 'template-request/preview';

/**
 * useTemplatePreview
 * Renders a template through mod-template-engine
 * (POST /template-request/preview). The editor owns the body; the subject
 * is only sent when the consumer opts in, so requests are unchanged for
 * those who do not.
 *
 * `enabled` gates the request on the template-engine interface being
 * present, so the caller can fall back to the regex preview when it is not.
 */
const useTemplatePreview = ({ templateBody, templateSubject, context, enabled }) => {
  const ky = useOkapiKy();

  const { data, isLoading, isError, error } = useQuery(
    ['stripes-template-editor', 'template-preview', templateBody, templateSubject, context],
    async () => {
      const json = {
        body: templateBody || '',
        context: context ?? {},
      };

      if (templateSubject !== undefined) json.header = templateSubject;

      try {
        return await ky.post(PREVIEW_PATH, { json }).json();
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
