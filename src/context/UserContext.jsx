import { createContext, useContext, useEffect, useState } from "react";
import { onUserStateChange } from "../api/firebase";
import { login, logout } from "../api/firebase";

// 컨텍스트 생성
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 컨텍스트로 전달하고 싶은 state
  const [user, setUser] = useState(false);

  // 로그인 상태 체크후 업데이트
  useEffect(() => {
    onUserStateChange(setUser);
  }, []);

  // 생성한 컨텍스트의 Provider 로 하이오더 컴포넌트를 생성
  // value 속성을 통해 사용하고 싶은 값(state)을 전달
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
