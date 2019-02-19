import React from 'react';
import style from '../styles/SubHeaders.scss';
import PropTypes from "prop-types";

class SubHeaders extends React.Component {
  render () {
    const {title} = this.props;
    return (
      <div className={style.subHeaders}>
        <div className={style.title}>{title}</div>
      </div>
    );
  }
}

SubHeaders.propTypes = {
  title: PropTypes.string.isRequired
};
SubHeaders.defaultProps = {
  title: '',
};

export default SubHeaders;
