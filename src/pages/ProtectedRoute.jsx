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
