import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
} from 'react-intl';
import classNames from 'classnames';

import css from './EditorToolbar.css';

const EditorToolbar = ({
  id,
  disabled,
  intl: {
    formatMessage,
  }
}) => {
  return (
    <div id={id}>
      <span className="ql-formats">
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.text.bold' })}
          className={classNames('ql-bold', { [css.disabled]: disabled })}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.text.italic' })}
          className={classNames('ql-italic', { [css.disabled]: disabled })}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.text.underline' })}
          className={classNames('ql-underline', { [css.disabled]: disabled })}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.list.ordered' })}
          className={classNames('ql-list', { [css.disabled]: disabled })}
          value="ordered"
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.list.bullet' })}
          className={classNames('ql-list', { [css.disabled]: disabled })}
          value="bullet"
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.indent.decrease' })}
          className={classNames('ql-indent', { [css.disabled]: disabled })}
          value="-1"
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.indent.increase' })}
          data-test-increase-indent
          className={classNames('ql-indent', { [css.disabled]: disabled })}
          value="+1"
        />
      </span>
      <span className="ql-formats">
        <select
          className="ql-size"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.size' })}
        >
          <option
            aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.size.small' })}
            value="10px"
          />
          <option
            aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.size.normal' })}
            defaultValue
          />
          <option
            aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.size.large' })}
            value="18px"
          />
          <option
            aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.size.huge' })}
            value="32px"
          />
        </select>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.align.noAlign' })}
          className={classNames('ql-align', { [css.disabled]: disabled })}
          value=""
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.align.center' })}
          className={classNames('ql-align', { [css.disabled]: disabled })}
          value="center"
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.align.right' })}
          className={classNames('ql-align', { [css.disabled]: disabled })}
          value="right"
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.align.justify' })}
          className={classNames('ql-align', { [css.disabled]: disabled })}
          value="justify"
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.link' })}
          className={classNames('ql-link', { [css.disabled]: disabled })}
        />
      </span>
      <span className="ql-formats">
        <button
          data-test-teplate-editor-tokens
          type="button"
          disabled={disabled}
          aria-label={formatMessage({ id: 'stripes-template-editor.toolbar.token' })}
          className="ql-token"
        >
          {'{ }'}
        </button>
      </span>
    </div>
  );
};

EditorToolbar.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  intl: PropTypes.object,
};

export default injectIntl(EditorToolbar);
