import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';
import { useStripes, useOkapiKy } from '@folio/stripes/core';

import buildPreviewContent from '../previewContent';

const TEMPLATE_ENGINE_INTERFACE = 'template-engine';
const TEMPLATE_ENGINE_VERSION = '2.3';
const PREVIEW_PATH = 'template-request/preview';

/**
 * BackendPreview
 * Opt-in preview that renders the template through mod-template-engine
 * (POST /template-request/preview) instead of the local regex resolver,
 * so loops/conditionals match the email the recipient actually receives.
 *
 * The TemplateEditor edits a single field (the body), so only
 * { body, context } is sent and the rendered body is shown.
 *
 * Guarded by the template-engine interface: if a tenant has no (or an
 * older) mod-template-engine, hasInterface is false and we render the
 * regex `fallback` instead - no crash, no 404.
 */
const BackendPreview = ({ templateBody, context, fallback }) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const kyRef = useRef(ky);

  kyRef.current = ky;

  const hasInterface = stripes.hasInterface(TEMPLATE_ENGINE_INTERFACE, TEMPLATE_ENGINE_VERSION);
  const contextKey = JSON.stringify(context ?? {});

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!hasInterface) return undefined;

    let cancelled = false;

    setLoading(true);
    setError(false);

    kyRef.current.post(PREVIEW_PATH, {
      json: {
        body: templateBody || '',
        context: context ?? {},
      },
    })
      .json()
      .then(data => {
        if (!cancelled) setContent(buildPreviewContent(data?.body || ''));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // context is compared via contextKey to avoid refetching when a new
    // object identity carries identical content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInterface, templateBody, contextKey]);

  if (!hasInterface) return fallback;

  if (loading) return <Loading size="large" />;

  if (error) {
    return (
      <div data-test-backend-preview-error>
        <FormattedMessage id="stripes-template-editor.preview.backendError" />
      </div>
    );
  }

  return content;
};

BackendPreview.propTypes = {
  templateBody: PropTypes.string,
  context: PropTypes.object,
  fallback: PropTypes.node,
};

export default BackendPreview;
