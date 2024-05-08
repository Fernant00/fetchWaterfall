import { useState, useEffect } from 'react'
import './App.css'

const useImageURL = () => {
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [res1, setRes1] = useState();
  const [res2, setRes2] = useState();


  useEffect(() => {
    const dataFetch = async () => {
      const result =(
        await Promise.all([
    // Simulando una primera solicitud de imagen
    fetch("https://jsonplaceholder.typicode.com/photos/1", { mode: "cors" })
      .then((response)=>{
        if (response.status >= 400){
          throw new Error("Server error!!");
        }
        return response.json();
      })
      .then((response) => {
        console.log(response)
        setImageURL(response.url)
      })
      .catch((error) => setError(error))
      .finally(()=>setLoading(false)),

    // Simulando una segunda solicitud de imagen después de un retraso
    fetch("https://jsonplaceholder.typicode.com/photos/2", { mode: "cors" })
    .then((response)=>{
      if (response.status >= 400){
        throw new Error("Server error!!");
      }
      return response.json();
    })
    .then((response) => {
      console.log(response)
      // Aquí solo estamos actualizando la URL de la imagen sin cambiar el estado de carga
      setImageURL(response.url)
    })
    .catch((error) => setError(error)),
  ])
  ).map((r)=> r.json());

  const [img1, img2] =
        await Promise.all(result);

  // when the data is ready, save it to state
      setRes1(img1);
      setRes2(img2);

  };

  dataFetch();
  }, []);

  return { res1,res2,imageURL, error, loading };
};

function App() {
  const { imageURL, error, loading } = useImageURL();

  if (loading) return <p>Loading...</p>
  if (error) return <p> A network error was encountered ! </p>

  return (
    imageURL && (
      <>
        <h1>An image</h1>
        <img src={imageURL} alt={"placeholder text"} />
      </>
    )
  )
}

export default App