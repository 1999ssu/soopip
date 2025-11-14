import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  registerUser,
  loginUser,
  logoutUser,
  //   resetPassword,
  getUserData,
} from "@/features/auth/api/auth.api";
import { auth } from "@/lib/firebase";
import { type UserData } from "@/features/auth/types/auth.types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
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

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const newUser = await registerUser(name, email, password);
      const data = await getUserData(newUser.uid);
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
