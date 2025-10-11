const React = require('react');

const NextImage = ({ src, alt, ...props }) => {
  return React.createElement('img', { src, alt, ...props });
};

NextImage.defaultProps = {
  src: '',
  alt: '',
};

module.exports = NextImage;
