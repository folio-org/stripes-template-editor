import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ReactQuill, { Quill } from 'react-quill';
import { v4 as uuidv4 } from 'uuid';

import {
  isNull,
  forEach,
  includes,
} from 'lodash';

import {
  Col,
  Row,
  Button,
  TextArea,
} from '@folio/stripes/components';

import TokensModal from './TokensModal';
import EditorToolbar from './EditorToolbar';
import PreviewModal from './PreviewModal';
import ControlHeader from './ControlHeader';
import ValidationContainer from './ValidationContainer';
import { sanitize } from './sanitizer';

import tokensReducer from './tokens-reducer';
import IndentStyle from './Attributors/indent';

// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!react-quill/dist/quill.snow.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!./quillCustom.css';
import css from './TemplateEditor.css';

const QuillAlignStyle = Quill.import('attributors/style/align');
const QuillSizeStyle = Quill.import('attributors/style/size');
const QuillBlock = Quill.import('blots/block');
const QuillIndentStyle = Quill.import('formats/indent');

Quill.register(QuillAlignStyle, true);
Quill.register(QuillSizeStyle, true);

class TemplateEditor extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.node.isRequired,
    meta: PropTypes.object.isRequired,
    tokens: PropTypes.object.isRequired,
    tokensList: PropTypes.func.isRequired,
    previewModalHeader: PropTypes.node.isRequired,
    printable: PropTypes.bool,
    required: PropTypes.bool,
    selectedCategory: PropTypes.string,
    editAsHtml: PropTypes.bool,
    intl: PropTypes.object,
  };

  static defaultProps = {
    printable: false,
    required: false,
    selectedCategory: '',
    editAsHtml: false,
  };

  constructor(props) {
    super(props);

    QuillBlock.tagName = 'div';

    Quill.register(QuillBlock, true);
    Quill.register('formats/indent', IndentStyle, true);

    this.quill = React.createRef();
    this.quillId = `rte-${uuidv4()}`;
    this.quillToolbarId = `rte-toolbar-${uuidv4()}`;
    this.textAreaRef = React.createRef();

    this.modules = {
      toolbar: {
        container: `#${this.quillToolbarId}`,
        handlers: {
          token: this.openTokenDialog,
        }
      },
      clipboard: {
        matchVisual: false,
      },
    };

    this.state = {
      openDialog: false,
      showTokensDialog: false,
      cursorPosition: null,
    };
  }

  /*
    Indent attributor overrides default one globally for TemplateEditor and Quill doesn't support formatters on instance level.
    Plus there is no unregister functionality, so componentWillUnmount is used to restore default Quill fromatters
  */
  componentWillUnmount() {
    QuillBlock.tagName = 'p';

    Quill.register(QuillBlock, true);
    Quill.register('formats/indent', QuillIndentStyle, true);
  }

  onChange = (value) => {
    const { onChange } = this.props.input;
    const { cursorPosition } = this.state;

    onChange(value);

    if (!isNull(cursorPosition)) {
      this.quill.current.editor.setSelection(cursorPosition);
      this.setState({ cursorPosition: null });
    }
  };

  onBlur = () => {
    const {
      input: {
        value,
        onBlur,
      },
    } = this.props;

    onBlur(value);
  };

  openPreviewDialog = () => {
    this.setState({ openDialog: true });
  };

  closePreviewDialog = () => {
    this.setState({ openDialog: false });
  };

  openTokenDialog = () => {
    this.setState({ showTokensDialog: true });
  };

  closeTokenDialog = () => {
    this.setState({ showTokensDialog: false });
    if (this.quill.current) {
      this.quill.current.focus();
    }
  };

  // insertTokensIntoHtml() and insertTokensIntoQuill() are equivalent
  // functions used to insert tokens into the HTML of the TextArea or
  // into the Quill editor -- the appropriate function is called
  // depending on which kind of editor is in use.

  // Note: the HTML version does not attempt to support
  // `isLoopSelected`.  The immediate need for HTML editing is in the
  // context of staff slips, which do not make use of loops. When we
  // come to the point of needing HTML editing for other kinds of
  // templates that use them, that will give us the opportunity (and
  // motivation) for writing and running the relevant new code.
  //
  // Because the textarea is controlled by react-final-form, we have
  // to use its API (the `input.onChange` prop) to set the value,
  // rather than just manipulating the DOM element. But there is no
  // final-form API for reading the selection start and end, or for
  // setting the cursor position. (These are considered state rather
  // than value, and final-form is concerned only with values.)
  // Consequently the value in the DOM element doesn't get set until
  // final-form has had a chance to operate: hence the use of
  // requestAnimationFrame to delay the positioning of the cursor
  // until that has happened.
  //
  insertTokensIntoHtml = (tokens = {}) => {
    const text = Object.keys(tokens).map(key => tokens[key].tokens.map(s => `{{${s}}}`).join('')).join('');

    const elem = document.getElementById(this.quillId);
    const start = elem.selectionStart;
    const end = elem.selectionEnd;
    const newValue = elem.value.substring(0, start) + text + elem.value.substring(end);
    this.props.input.onChange(newValue);

    requestAnimationFrame(() => {
      elem.focus();
      // In a rational world, we would just do a multiple assignment
      // here, but someone somewhere decided that ESLint ought to
      // whine about that, because of course an automated tool has
      // better taste than an actual programmer with 45 years'
      // experience, so instead we will express the intention in a
      // more verbose and less clear way to satisfy the hungry gods of
      // ESLint. Truly, this is an age of wonders.
      elem.selectionStart = start + text.length;
      elem.selectionEnd = start + text.length;
    });
  };

  insertTokensIntoQuill = (tokens = {}) => {
    forEach(tokens, (tokensGroup) => {
      if (tokensGroup.isLoopSelected) {
        this.insertRepeatingTokens(tokensGroup.tokens, tokensGroup.tag);
      } else {
        this.insertRegualarTokens(tokensGroup.tokens);
      }
    });
  };

  insertRegualarTokens = (tokens) => {
    let tags = '';

    forEach(tokens, (token) => {
      tags += `{{${token}}}`;
    });

    const editor = this.quill.current.getEditor();
    const { index: cursorPosition } = editor.getSelection();
    editor.insertText(cursorPosition, tags);
    this.setState({ cursorPosition: cursorPosition + tags.length });
  };

  insertRepeatingTokens = (tokens, tag) => {
    let tags = '';
    const startTag = `{{#${tag}}}`;
    const endTag = `{{/${tag}}}`;

    const editor = this.quill.current.getEditor();
    const editorContent = editor.getText();
    const loopExists = includes(editorContent, startTag) && includes(editorContent, endTag);

    if (loopExists) {
      forEach(tokens, (token) => {
        tags += `{{${token}}}\n`;
      });
    } else {
      tags = `${startTag}`;
      forEach(tokens, (token) => {
        tags += `\n{{${token}}}`;
      });
      tags += `\n${endTag}`;
    }

    const cursorPosition = loopExists ? editorContent.indexOf(endTag) : editor.getSelection().index;
    editor.insertText(cursorPosition, tags);
    this.setState({ cursorPosition: cursorPosition + tags.length });
  };

  render() {
    const {
      openDialog,
      showTokensDialog,
    } = this.state;

    const {
      label,
      tokens,
      input: { value },
      tokensList,
      meta: {
        submitFailed,
        valid,
        touched,
        error,
      },
      previewModalHeader,
      printable,
      required,
      selectedCategory,
      name,
      editAsHtml,
      intl: { formatMessage }
    } = this.props;

    const invalid = (touched || submitFailed) && !valid && !showTokensDialog;

    const appliedValue = sanitize(value);

    const extraButton = !editAsHtml ? undefined : (
      <Button
        bottomMargin0
        onClick={this.openTokenDialog}
        aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.token' })}
      >
        {'{ }'}
      </Button>
    );

    return (
      <>
        <Row>
          <Col xs={12}>
            <ControlHeader
              label={label}
              required={required}
              onPreviewClick={this.openPreviewDialog}
              extraButton={extraButton}
            />
            <Row>
              <Col xs={12}>
                {editAsHtml ?
                  <TextArea
                    id={this.quillId}
                    ref={this.textAreaRef}
                    name={name}
                    value={value}
                    onChange={newValue => this.props.input.onChange(sanitize(newValue))}
                    rows="12"
                  /> :
                  <div {... invalid ? { className: css.error } : {}}>
                    <EditorToolbar id={this.quillToolbarId} />
                    <ReactQuill
                      id={this.quillId}
                      className={css.editor}
                      value={appliedValue}
                      ref={this.quill}
                      modules={this.modules}
                      onChange={this.onChange}
                      onBlur={this.onBlur}
                      bounds={`#${this.quillId}`}
                    />
                  </div>
                }
              </Col>
            </Row>
            { invalid && <ValidationContainer error={error} /> }
          </Col>
        </Row>
        <PreviewModal
          open={openDialog}
          header={previewModalHeader}
          previewFormat={tokensReducer(tokens)}
          previewTemplate={value}
          printable={printable}
          onClose={this.closePreviewDialog}
        />
        <TokensModal
          isOpen={showTokensDialog}
          tokens={tokens}
          list={tokensList}
          selectedCategory={selectedCategory}
          onAdd={editAsHtml ? this.insertTokensIntoHtml : this.insertTokensIntoQuill}
          onCancel={this.closeTokenDialog}
        />
      </>
    );
  }
}

export default injectIntl(TemplateEditor);
