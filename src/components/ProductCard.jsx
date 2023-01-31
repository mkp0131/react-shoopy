import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  product: { id, image, title, options, price },
}) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`products/${id}`, { state: { product } });
  };
  return (
    <li
      className="rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={handleOnClick}
    >
      <img
        referrerPolicy="no-referrer"
        src={image}
        alt={title}
        className="w-full"
      />
      <div className="mt-2 px-2 text-lg flex justify-between items-center">
        <h3 className="truncate">{title}</h3>
        <p>{`₩${price}`}</p>
      </div>
      <p className="mb-2 px-2 text-gray-600 text-sm">{options.join(", ")}</p>
    </li>
  );
};

export default ProductCard;
