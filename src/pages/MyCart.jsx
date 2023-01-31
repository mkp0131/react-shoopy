import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/firebase";
import CartItem from "../components/CartItem";
import PriceCard from "../components/PriceCard";
import { useUserContext } from "../context/UserContext";
import { AiOutlinePlus } from "react-icons/ai";
import { TbEqual } from "react-icons/tb";
import Button from "../components/ui/Button";

const SHIPPING = 3000;

const MyCart = () => {
  const {
    user: { uid },
  } = useUserContext();

  const { isLoading, data: products } = useQuery(["cart"], () => getCart(uid), {
    refetchOnWindowFocus: false, // 포커스 toggle 시 refetch
    refetchOnMount: false, // 컴포넌트 리랜더링시 refetch
    enabled: false, // 초기 로드 방지
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const hasProducts = products && products.length > 0;
  const totalPrice =
    products &&
    products.reduce(
      (prev, current) => prev + parseInt(current.price) * current.quantity,
      0
    );

  return (
    <section className="px-2 flex flex-col">
      <h2 className="text-2xl font-bold my-4 text-center">내 장바구니</h2>
      {!hasProducts && <p>장바구니에 상품이 없습니다.</p>}
      {hasProducts && (
        <>
          <ul className="border-b border-gray-300 mb-8 p-4">
            {products.map((product) => (
              <CartItem key={product.id} product={product} userId={uid} />
            ))}
          </ul>
        </>
      )}
      <div className="flex justify-between items-center mb-10 px-2 md:px-8 lg:px-16">
        <PriceCard price={totalPrice} text="상품 총액" />
        <AiOutlinePlus className="shrink-0" />
        <PriceCard price={SHIPPING} text="배송비" />
        <TbEqual className="shrink-0" />
        <PriceCard price={totalPrice + SHIPPING} text="총금액" />
      </div>
      <Button text="주문하기" />
    </section>
  );
};

export default MyCart;
