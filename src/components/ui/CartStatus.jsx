import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { getCart } from "../../api/firebase";
import { useUserContext } from "../../context/UserContext";

const CartStatus = () => {
  const {
    user: { uid },
  } = useUserContext();

  const { data: products, refetch } = useQuery(["cart"], () => getCart(uid), {
    refetchOnWindowFocus: false, // 포커스 toggle 시 refetch
    refetchOnMount: false, // 컴포넌트 리랜더링시 refetch
    enabled: false, // 초기 로드 방지
  });

  useEffect(() => {
    if (uid) {
      refetch();
    }
  }, [uid]);

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <AiOutlineShoppingCart className="text-xl" />
        {products && (
          <span className="w-5 h-5 bg-brand rounded-full text-white flex items-center justify-center text-sm absolute -top-2 -right-2">
            {products.length}
          </span>
        )}
      </div>
      장바구니
    </div>
  );
};

export default CartStatus;
