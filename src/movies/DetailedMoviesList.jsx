import React, { useEffect, useState } from "react";
import DetailedMovie from "./DetailedMovie";
import ErrorAlert from "../shared/ErrorAlert";
import { listMovies } from "../utils/api";

function DetailedMoviesList() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setError(null);
    const abortController = new AbortController();
    let isCurrent = true;

    listMovies(abortController.signal)
      .then((movies) => {
        if (isCurrent) {
          setMovies(movies);
        }
      })
      .catch((error) => {
        if (isCurrent && error.name !== "AbortError") {
          setError(error);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
      abortController.abort();
    };
  }, []);

  const list = movies.map((movie) => (
    <DetailedMovie key={movie.movie_id} movie={movie} />
  ));

  return (
    <main className="container">
      <ErrorAlert error={error} />
      <h2 className="font-poppins">All Movies</h2>
      <hr />
      {isLoading && <p role="status">Loading movies...</p>}
      <section>{list}</section>
    </main>
  );
}

export default DetailedMoviesList;
