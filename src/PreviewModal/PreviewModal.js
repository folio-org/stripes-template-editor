import React from 'react';
import ReactToPrint from 'react-to-print';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
} from '@folio/stripes/components';

import templateResolver from '../template-resolver';
import buildPreviewContent from '../previewContent';
import BackendPreview from '../BackendPreview';
import css from './PreviewModal.css';

class PreviewModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    printable: PropTypes.bool,
    previewTemplate: PropTypes.string,
    header: PropTypes.node.isRequired,
    previewFormat: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    previewRenderer: PropTypes.oneOf(['regex', 'backend']),
    previewContext: PropTypes.object,
    previewSubject: PropTypes.string,
  };

  static defaultProps = {
    previewTemplate: '',
    printable: false,
    previewRenderer: 'regex',
  };

  constructor(props) {
    super(props);

    this.editorRef = React.createRef();
  }

  renderFooter = () => {
    const {
      printable,
      onClose,
    } = this.props;

    const printableFooter = (
      <div className={css.footer}>
        <Button
          data-test-close-tokens-modal
          marginBottom0
          onClick={onClose}
        >
          <FormattedMessage id="stripes-core.button.close" />
        </Button>
        <ReactToPrint
          removeAfterPrint
          trigger={() => (
            <Button
              data-test-print-modal-template
              buttonStyle="primary"
              marginBottom0
            >
              <FormattedMessage id="stripes-template-editor.print" />
            </Button>
          )}
          content={() => this.editorRef.current}
        />
      </div>
    );

    const footer = (
      <>
        <Button
          buttonStyle="primary"
          marginBottom0
          onClick={onClose}
        >
          <FormattedMessage id="stripes-template-editor.close" />
        </Button>
      </>
    );

    return printable ? printableFooter : footer;
  };

  render() {
    const {
      open,
      previewTemplate,
      previewFormat,
      header,
      previewRenderer,
      previewContext,
      previewSubject,
    } = this.props;

    const regexContent = buildPreviewContent(templateResolver(previewTemplate)(previewFormat));

    // Only mount BackendPreview while the modal is open, so we do not
    // POST to the backend for a hidden modal. Regex stays the default
    // and is also the fallback when the interface is unavailable.
    const contentComponent = (previewRenderer === 'backend' && open)
      ? (
        <BackendPreview
          templateBody={previewTemplate}
          templateSubject={previewSubject}
          context={previewContext}
          fallback={regexContent}
        />
      )
      : regexContent;

    return (
      <Modal
        open={open}
        label={header}
        id="preview-modal"
        size="medium"
        footer={this.renderFooter()}
      >
        <div
          className="editor-preview"
          ref={this.editorRef}
        >
          {contentComponent}
        </div>
      </Modal>
    );
  }
}

export default PreviewModal;
