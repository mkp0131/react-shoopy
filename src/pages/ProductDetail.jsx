import { useState } from "react";
import { useLocation } from "react-router-dom";
import { addCart } from "../api/firebase";
import Button from "../components/ui/Button";
import { useUserContext } from "../context/UserContext";

const ProductDetail = () => {
  const {
    user: { uid },
  } = useUserContext();

  const {
    state: {
      product: { id, image, title, options, price, description },
    },
  } = useLocation();

  const [selected, setSelected] = useState(options && options[0]);

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected(value);
  };

  const handleClick = () => {
    // 장바구니 추가
    const product = {
      id,
      image,
      title,
      price,
      option: selected,
      quantity: 1,
    };
    addCart(uid, product);
  };

  return (
    <section className="flex flex-col md:flex-row p-4">
      <img src={image} alt={title} className="w-full px-4 basis-7/12" />
      <div className="w-full basis-5/12 flex flex-col p-4">
        <h2 className="text-3xl font-bold py-2 ">{title}</h2>
        <p className="text-2xl font-bold py-2 border-b border-gray-400">{`₩${price}`}</p>
        <p className="py-4 text-lg">{description}</p>
        <div className="flex items-center">
          <label htmlFor="select" className="text-brand font-bold">
            옵션
          </label>
          <select
            id="select"
            value={selected}
            onChange={handleSelect}
            className="p-2 m-4 flex-1 border-2 border-dashed border-brand outline-none"
          >
            {options &&
              options.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
        <Button text="장바구니에 추가" onClick={handleClick} />
      </div>
    </section>
  );
};

export default ProductDetail;
