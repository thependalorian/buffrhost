const Image = ({ src, alt, ...props }) => {
  // eslint-disable-next-line @next/next/no-img-element
  return React.createElement('img', {
    src,
    alt,
    ...props,
  });
};

module.exports = Image;
