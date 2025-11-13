import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
export const getUserData = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error("유저 데이터를 찾을 수 없습니다.");
  }
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
