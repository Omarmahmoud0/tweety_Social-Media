import { auth, db } from "@/firebase/firebase";
import { IContextType, IUser } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  email: "",
  username: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  setUser: () => {},
  token: "",
  setToken: () => {},
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>("");
  const navigator = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData) {
          setUser({
            id: user.uid,
            name: userData.name,
            email: userData.email,
            username: userData.username,
            imageUrl: userData.imageUrl,
            bio: userData.bio,
          });
          setToken(user.uid);
        }
      } else {
        console.log("User is signed out");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("token");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  useEffect(() => {
    const eixist = ["/sign-in", "/sign-up"];
    if (!eixist.includes(pathname)) {
      localStorage.setItem("lastPathname", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const Path = localStorage.getItem("lastPathname") || "/";
    if (token) {
      navigator(Path, { replace: true });
    } else {
      navigator("/sign-in");
    }
  }, [token]);

  const value = {
    user,
    isLoading,
    setUser,
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
