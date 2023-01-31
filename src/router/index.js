import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import AllProducts from "../pages/AllProducts";
import Home from "../pages/Home";
import MyCart from "../pages/MyCart";
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
            <MyCart />
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
