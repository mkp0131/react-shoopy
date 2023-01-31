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
