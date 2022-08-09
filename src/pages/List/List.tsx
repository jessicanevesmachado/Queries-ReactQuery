import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getDogs } from "../../api/dogs";
import { TOTAL_PER_PAGE } from "../../constants";
import { IDog, IDogPaginantion } from "../../types/IDog";
import { Dog, RenderPaginantionDog } from "./Dog";

export const List = () => {
  const [dogs, setDogs] = useState<IDogPaginantion>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setLoading(true);
    getDogs(currentPage)
      .then((dogs) => {
        setDogs(dogs);
      })
      .catch((error) => {
        setError(error.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  if (isError) {
    return (
      <Alert className="loading" severity="error">
        {isError}
      </Alert>
    );
  }

  if (isLoading || !dogs?.data) {
    return (
      <div className="loading">
        <CircularProgress />
        <Box sx={{ paddingLeft: "10px" }}>Buscando a lista de Dogs ...</Box>
      </div>
    );
  }

  return (
    <div>
      <h1 className="title">Lista de Dogs</h1>

      <RenderPaginantionDog
        currentPage={currentPage}
        totalItens={dogs.totalItens}
      />

      <div className="flex">
        {dogs.data.map((dog: IDog) => (
          <Dog
            key={dog.id}
            id={dog.id}
            name={dog.name}
            description={dog.description}
            image={dog.image}
            breed={dog.breed}
          />
        ))}
      </div>

      <div className="actionButton">
        <Button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          disabled={!dogs.hasPrevious}
          variant="text"
        >
          Anterior
        </Button>
        <Button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          disabled={!dogs.hasNext}
          variant="text"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};
