import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import buildPreviewContent from '../previewContent';
import useTemplatePreview from './useTemplatePreview';

const TEMPLATE_ENGINE_INTERFACE = 'template-engine';
const TEMPLATE_ENGINE_VERSION = '2.3';

/**
 * BackendPreview
 * Opt-in preview that renders the template through mod-template-engine
 * instead of the local regex resolver, so loops/conditionals match the
 * email the recipient actually receives.
 *
 * Guarded by the template-engine interface: if a tenant has no (or an
 * older) mod-template-engine, hasInterface is false and we render the
 * regex `fallback` instead - no crash, no 404.
 */
const BackendPreview = ({ templateBody, context, fallback }) => {
  const stripes = useStripes();
  // hasInterface returns the interface version (string) or undefined, so
  // coerce to a real boolean for the `enabled` flag (react-query requires it).
  const hasInterface = Boolean(stripes.hasInterface(TEMPLATE_ENGINE_INTERFACE, TEMPLATE_ENGINE_VERSION));

  const { data, isLoading, isError } = useTemplatePreview({
    templateBody,
    context,
    enabled: hasInterface,
  });

  if (!hasInterface) return fallback;

  if (isLoading) return <Loading size="large" />;

  if (isError) {
    return (
      <div data-test-backend-preview-error>
        <FormattedMessage id="stripes-template-editor.preview.backendError" />
      </div>
    );
  }

  return buildPreviewContent(data?.body || '');
};

BackendPreview.propTypes = {
  templateBody: PropTypes.string,
  context: PropTypes.object,
  fallback: PropTypes.node,
};

export default BackendPreview;
