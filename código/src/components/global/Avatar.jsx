// src/components/Avatar.jsx
import PropTypes from "prop-types";

const sizeClass = {
  small: "",
  medium: "medium",
  large: "large",
};

export default function Avatar({ letter, title, size = "small", colorClass }) {
  return (
    <span className={`br-avatar ${sizeClass[size]} mr-3`} title={title}>
      <span className={`content ${colorClass}`}>{letter.toUpperCase()}</span>
    </span>
  );
}

Avatar.propTypes = {
  letter: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small","medium","large"]),
  colorClass: PropTypes.string,
};