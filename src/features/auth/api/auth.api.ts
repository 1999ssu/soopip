import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { UserData } from "../types/auth.types";

export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Firestore에 유저 데이터 저장
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: name || "새 사용자",
    createdAt: new Date().toISOString(),
  });

  return user;
};

// 특정 유저 데이터 가져오기
export const getUserData = async (uid: string): Promise<UserData> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("유저 정보를 찾을 수 없습니다.");

  const data = docSnap.data();

  // 타입 단언
  return {
    name: data.name as string,
    email: data.email as string,
    // password는 테스트용이면 그대로
    // password: data.password as string,
  };
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const logoutUser = async () => {
  return await signOut(auth);
};
