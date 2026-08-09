import React from "react";

const fallbackPoster =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">' +
      '<rect width="100%" height="100%" fill="#e9ecef"/>' +
      '<rect x="18" y="18" width="264" height="414" fill="#f8f9fa" stroke="#ced4da" stroke-width="4"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="18">' +
      "Poster Unavailable" +
      "</text>" +
      "</svg>"
  );

function PosterImage({ src, alt, onError, ...rest }) {
  const handleError = (event) => {
    event.target.onerror = null;
    event.target.src = fallbackPoster;
    if (onError) {
      onError(event);
    }
  };

  return (
    <img src={src || fallbackPoster} alt={alt} onError={handleError} {...rest} />
  );
}

export default PosterImage;
