import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { addCart, removeCart } from "../api/firebase";

const ICON_CLASS =
  "transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1";

const CartItem = ({
  product,
  product: { id, image, title, option, quantity, price },
  userId,
}) => {
  const handleMinus = () => {
    if (quantity < 2) return;
    addCart(userId, {
      ...product,
      quantity: product.quantity - 1,
    });
  };
  const handlePlus = () => {
    addCart(userId, {
      ...product,
      quantity: product.quantity + 1,
    });
  };
  const handleDelete = () => {
    removeCart(userId, id);
  };

  return (
    <li className="flex justify-between my-2 items-center">
      <img className="w-24 md:w-48 rounded-lg" src={image} alt={title} />
      <div className="flex-1 flex justify-between ml-4">
        <div className="basis-3/5">
          <p className="text-lg">{title}</p>
          <p className="text-xl font-bold text-brand">{option}</p>
          <p>₩{price}</p>
        </div>
        <div className="text-2xl flex items-center">
          <AiOutlinePlusSquare onClick={handlePlus} className={ICON_CLASS} />
          <span>{quantity}</span>
          <AiOutlineMinusSquare onClick={handleMinus} className={ICON_CLASS} />
          <RiDeleteBin5Fill onClick={handleDelete} className={ICON_CLASS} />
        </div>
      </div>
    </li>
  );
};

export default CartItem;
