import { Link } from "react-router-dom";
import { AiOutlineShopping, AiOutlinePlusSquare } from "react-icons/ai";

import User from "./User";
import Button from "./ui/Button";
import { useUserContext } from "../context/UserContext";
import CartStatus from "./ui/CartStatus";

const NavBar = () => {
  const { user, login, logout } = useUserContext();

  return (
    <header className="flex justify-between border-gray-300 border-b p-2">
      <Link to={""} className="flex items-center text-4xl text-brand">
        <AiOutlineShopping />
        <h1>Shoppy</h1>
      </Link>
      <nav className="flex items-center gap-4 font-semibold">
        <Link to="/products">제품</Link>

        {user && (
          <Link to="/carts">
            <CartStatus />
          </Link>
        )}
        {user && user.isAdmin && (
          <Link to="/products/new" className="flex items-center gap-1">
            <AiOutlinePlusSquare />
            제품 추가
          </Link>
        )}

        {user && <User user={user} />}
        {user ? (
          <Button onClick={logout} text="로그아웃" />
        ) : (
          <Button onClick={login} text="로그인" />
        )}
      </nav>
    </header>
  );
};

export default NavBar;
