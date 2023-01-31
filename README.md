# React-shoppy

## 라우터

```
<App>

/ 👉 <Home>

/products 👉 <AllProducts>

/products/new 👉 <NewProduct>

/products/:id 👉 <ProductDetail>

/carts 👉 <MyCart>
```

## [react] react-router 권한체크

- `pages/ProtectedRoute.jsx` 파일 생성

```js
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

// requireAdmin 은 admin 사용자 권한
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useUserContext();

  // 유저가 없거나,
  // admin 페이지인데 admin 권한이 없을 경우
  if (!user || (requireAdmin && !user.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

- 보호하고 싶은 라우터에

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
    element: <App />, // 레이아웃 컴포넌트
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

## [react] react-query useMutation 사용법

- 참고문서: https://velog.io/@kimhyo_0218/React-Query-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BF%BC%EB%A6%AC-useMutation-%EA%B8%B0%EB%B3%B8-%ED%8E%B8

### 기본사용

- mutation은 데이터를 생성 / 업데이트 / 삭제 할 때 사용
- 인터페이스: mutationFn 에는 실행할 함수를 넣는다.

```js
mutate(mutationFn, {
  onError,
  onSettled,
  onSuccess,
});
```

- 사용예제: 변수에 useMutation 을 저장한다.

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

- 저장한 변수를 `mutate` 메소드를 사용하여 실행

```js
mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
```

```js
addProduct.mutate(
  { product, url },
  {
    onSuccess: () => {
      setSuccess("성공적으로 제품이 추가 되었습니다.");
      setTimeout(() => {
        setSuccess(null);
      }, 4000);
    },
  }
);
```

- <span style="color: red;">두 곳에서 추가 콜백(onSuccess, onSettled, onError)을 실행할 경우 useMutation 의 추가 콜백 -> mutate 의 추가 콜백 순서로 실행</span>

## [react] react-query 리팩토링

- Custom Hook 을 만들어 리팩토링한다.
- `hooks/useProducts.jsx` 생성

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

- 사용

```js
const {
  productsQuery: { isLoading, error, data: products },
} = useProducts();
```

---

## 파이어베이스 기본사용

### 참고 레포

- https://github.com/mkp0131/twitJS

### 세팅

- 파이어베이스 설치 <ProtectedRoute> 컴포넌트를 감싸준다.

```

npm i firebase

```

- `api/firebase.js` 파일 생성
- 파이어베이스 콘솔에 나와있는 설정 코드 복사 => 필요없는 항목 삭제

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

- 해당파일에 파이어베이스 로직 (인증)을 모두 작성한다.

### 사용법

```js
// db 읽기
export async function getCart(userId) {
  return get(ref(db, `carts/${userId}`)).then((snapshot) => {
    const items = snapshot.val() || {};
    return Object.values(items);
  });
}

// db 저장
export async function addCart(userId, product) {
  // 파이어 베이스 저장
  return set(ref(db, `carts/${userId}/${product.id}`), product);
}

// db 삭제
export async function removeCart(userId, productId) {
  return remove(ref(db, `carts/${userId}/${productId}`));
}
```
