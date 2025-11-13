import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  registerUser,
  loginUser,
  logoutUser,
  //   resetPassword,
  getUserData,
} from "@/features/auth/auth.api";
import { auth } from "@/lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase Auth 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const newUser = await registerUser(email, password, name);
      const data = await getUserData(newUser.uid);
      setUserData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(email, password);
      const data = await getUserData(loggedInUser.user.uid);
      setUserData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserData(null);
  };

  return { user, userData, loading, error, signUp, login, logout };
};
