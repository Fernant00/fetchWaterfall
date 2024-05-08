# Resumen How to Fetch Data in React

- Los datos bajo demanda son algo que se obtiene después de que un usuario interactúa con una página, con el fin de actualizar su experiencia. Todos los autocompletados, los formularios dinámicos y las experiencias de búsqueda entran en esa categoría. En React, la obtención de estos datos suele activarse en las devoluciones de llamada.

- Los datos iniciales son los datos que esperarías ver en una página de inmediato cuando la abras. Son los datos que necesitamos obtener antes de que un componente termine en la pantalla. Es algo que necesitamos para poder mostrar a los usuarios una experiencia significativa lo antes posible. En React, la obtención de datos como este suele ocurrir en (o en los componentes de la clase).useEffectcomponentDidMount

- Cómo resolver solicitudes en cascada
Solución Promise.all
La primera solución, y la más sencilla, es llevar todas esas solicitudes de obtención de datos lo más alto posible en el árbol de renderizado. En nuestro caso, es nuestro componente raíz. Pero hay una trampa ahí: no puedes simplemente "moverlos" y dejarlos como están. 

 El tiempo en el que todos los datos estarán disponibles para su renderizado será la suma de todos esos tiempos de espera: 1s + 2s + 3s = 6 segundos. En su lugar, tenemos que dispararlos todos al mismo tiempo, para que se envíen en paralelo. De esa manera estaremos esperando a todos ellos no más que el más largo de ellos: 3 segundos. ¡50% de mejora del rendimiento! await

 Una forma de hacerlo es usar Promise.all:
```js
useEffect(async () => {
  const [sidebar, issue, comments] = await Promise.all([
    fetch('/get-sidebar'),
    fetch('/get-issue'),
    fetch('/get-comments'),
  ]);
}, []);
```
y luego guárdalos todos en el estado en el componente principal y pásalos a los componentes secundarios como props

Aumentar la carga de datos como en los ejemplos anteriores, aunque es bueno para el rendimiento, es terrible para la arquitectura de la aplicación y la legibilidad del código. De repente, en lugar de buscar solicitudes de obtención de datos y sus componentes bien ubicados, tenemos un componente gigante que busca todo y una perforación masiva de accesorios en toda la aplicación.

una abstracción en torno a la obtención de datos que nos da la capacidad de obtener datos en un lugar de la aplicación y acceder a esos datos en otro, sin pasar por todos los componentes intermedios. Básicamente, como una minicapa de almacenamiento en caché por solicitud. En React "sin procesar" es solo un contexto simple:
```js
const Context = React.createContext();

export const CommentsDataProvider = ({ children }) => {
  const [comments, setComments] = useState();

  useEffect(async () => {
    fetch('/get-comments')
      .then((data) => data.json())
      .then((data) => setComments(data));
  }, []);

  return (
    <Context.Provider value={comments}>
      {children}
    </Context.Provider>
  );
};

export const useComments = () => useContext(Context);
```
Nuestros tres proveedores envolverán el componente y activarán las solicitudes de recuperación tan pronto como se monten en paralelo
```js

export const VeryRootApp = () => {
  return (
    <SidebarDataProvider>
      <IssueDataProvider>
        <CommentsDataProvider>
          <App />
        </CommentsDataProvider>
      </IssueDataProvider>
    </SidebarDataProvider>
  );
};
```
Y luego, en algo como (es decir, muy, muy profundo en el árbol de renderizado desde la aplicación raíz) accederemos a esos datos desde el "proveedor de datos":Comments
```js
const Comments = () => {
  // Look! No props drilling!
  const comments = useComments();
};
```
## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
