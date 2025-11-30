import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "@/features/auth/api/auth.api";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { UserData } from "@/features/auth/types/auth.types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firestore에서 유저 데이터 가져오기, 없으면 새로 생성
  const fetchUserData = async (uid: string, email?: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name as string,
        email: data.email as string,
      };
    } else {
      const newUserData: UserData = {
        name: "새 사용자",
        email: email || "",
      };
      await setDoc(doc(db, "users", uid), newUserData);
      return newUserData;
    }
  };

  // Firebase Auth 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const data = await fetchUserData(
            currentUser.uid,
            currentUser.email || ""
          );
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
      const newUser = await registerUser(email, password, name);
      const data = await fetchUserData(newUser.uid, newUser.email || "");
      setUserData(data);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(email, password);
      const data = await fetchUserData(
        loggedInUser.user.uid,
        loggedInUser.user.email || ""
      );
      setUserData(data);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      return false;
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
