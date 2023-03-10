# React-shoppy

## λΌμ°ν°

```
<App>

/ π <Home>

/products π <AllProducts>

/products/new π <NewProduct>

/products/:id π <ProductDetail>

/carts π <MyCart>
```

## [react] react-router κΆνμ²΄ν¬

- `pages/ProtectedRoute.jsx` νμΌ μμ±

```js
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

// requireAdmin μ admin μ¬μ©μ κΆν
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useUserContext();

  // μ μ κ° μκ±°λ,
  // admin νμ΄μ§μΈλ° admin κΆνμ΄ μμ κ²½μ°
  if (!user || (requireAdmin && !user.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

- λ³΄νΈνκ³  μΆμ λΌμ°ν°μ

```js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import AllProducts from "../pages/AllProducts";
import Home from "../pages/Home";
import MyChart from "../pages/MyChart";
import NewProducts from "../pages/NewProduct";
import NotFound from "../pages/NotFoound";
import ProductDetail from "../pages/ProductDetail";
import ProtectedRoute from "../pages/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // λ μ΄μμ μ»΄ν¬λνΈ
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <AllProducts />,
      },
      {
        path: "products/new",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <NewProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "carts",
        element: (
          <ProtectedRoute>
            <MyChart />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
```

## [react] react-query useMutation μ¬μ©λ²

- μ°Έκ³ λ¬Έμ: https://velog.io/@kimhyo_0218/React-Query-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BF%BC%EB%A6%AC-useMutation-%EA%B8%B0%EB%B3%B8-%ED%8E%B8

### κΈ°λ³Έμ¬μ©

- mutationμ λ°μ΄ν°λ₯Ό μμ± / μλ°μ΄νΈ / μ­μ  ν  λ μ¬μ©
- μΈν°νμ΄μ€: mutationFn μλ μ€νν  ν¨μλ₯Ό λ£λλ€.

```js
mutate(mutationFn, {
  onError,
  onSettled,
  onSuccess,
});
```

- μ¬μ©μμ : λ³μμ useMutation μ μ μ₯νλ€.

```js
const addProduct = useMutation(
  ({ product, url }) => {
    return addNewProduct(product, url);
  },
  {
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  }
);
```

- μ μ₯ν λ³μλ₯Ό `mutate` λ©μλλ₯Ό μ¬μ©νμ¬ μ€ν

```js
mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
```

```js
addProduct.mutate(
  { product, url },
  {
    onSuccess: () => {
      setSuccess("μ±κ³΅μ μΌλ‘ μ νμ΄ μΆκ° λμμ΅λλ€.");
      setTimeout(() => {
        setSuccess(null);
      }, 4000);
    },
  }
);
```

- <span style="color: red;">λ κ³³μμ μΆκ° μ½λ°±(onSuccess, onSettled, onError)μ μ€νν  κ²½μ° useMutation μ μΆκ° μ½λ°± -> mutate μ μΆκ° μ½λ°± μμλ‘ μ€ν</span>

## [react] react-query λ¦¬ν©ν λ§

- Custom Hook μ λ§λ€μ΄ λ¦¬ν©ν λ§νλ€.
- `hooks/useProducts.jsx` μμ±

```js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNewProduct, getProducts } from "../api/firebase";

const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery(["products"], getProducts, {
    staleTime: 10000 * 60,
  });

  const addProduct = useMutation(
    ({ product, url }) => {
      return addNewProduct(product, url);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
      },
    }
  );

  return { productsQuery, addProduct };
};

export default useProducts;
```

- μ¬μ©

```js
const {
  productsQuery: { isLoading, error, data: products },
} = useProducts();
```

---

## νμ΄μ΄λ² μ΄μ€ κΈ°λ³Έμ¬μ©

### μ°Έκ³  λ ν¬

- https://github.com/mkp0131/twitJS

### μΈν

- νμ΄μ΄λ² μ΄μ€ μ€μΉ <ProtectedRoute> μ»΄ν¬λνΈλ₯Ό κ°μΈμ€λ€.

```

npm i firebase

```

- `api/firebase.js` νμΌ μμ±
- νμ΄μ΄λ² μ΄μ€ μ½μμ λμμλ μ€μ  μ½λ λ³΅μ¬ => νμμλ ν­λͺ© μ­μ 

```js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

- ν΄λΉνμΌμ νμ΄μ΄λ² μ΄μ€ λ‘μ§ (μΈμ¦)μ λͺ¨λ μμ±νλ€.

### μ¬μ©λ²

```js
// db μ½κΈ°
export async function getCart(userId) {
  return get(ref(db, `carts/${userId}`)).then((snapshot) => {
    const items = snapshot.val() || {};
    return Object.values(items);
  });
}

// db μ μ₯
export async function addCart(userId, product) {
  // νμ΄μ΄ λ² μ΄μ€ μ μ₯
  return set(ref(db, `carts/${userId}/${product.id}`), product);
}

// db μ­μ 
export async function removeCart(userId, productId) {
  return remove(ref(db, `carts/${userId}/${productId}`));
}
```
