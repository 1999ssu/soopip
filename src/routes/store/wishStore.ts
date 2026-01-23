// src/routes/store/wishStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/features/product/types/product.types";
import { CartItem } from "@/features/cart/types/cart.types"; // CartItem과 동일 구조 사용
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

// // const storedWish = localStorage.getItem("wish");
// const initialState: { items: CartItem[] } = {
//   items: storedWish ? JSON.parse(storedWish) : [],
// };

interface WishItem {
  id?: string;
  product: Product;
  quantity: number;
  selected: boolean;
  createdAt?: number;
}

interface WishState {
  items: WishItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishState = {
  items: [],
  loading: false,
  error: null,
};

const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    //1.19 추가
    ////////////////////////////////////////////////
    setWishItems: (state, action: PayloadAction<WishItem[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    ////////////////////////////////////////////////
    // addItem: (state, action: PayloadAction<Product>) => {
    // const product = action.payload;
    // const quantity = 1; // 기본 수량

    // state.items = state.items.filter((i) => i.product.id !== product.id);
    // state.items.push({ product, quantity, selected: false });

    // localStorage.setItem("wish", JSON.stringify(state.items));
    // },

    addItem: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === payload.product.id
      );

      if (existingIndex !== -1) {
        // 이미 있으면 위시 수량으로 완전히 덮어쓰기
        state.items[existingIndex].quantity = payload.quantity;
        state.items[existingIndex].selected =
          payload.selected ?? state.items[existingIndex].selected;
      } else {
        state.items.push(payload);
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.selected = !item.selected;
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    selectAll: (state) => {
      state.items.forEach((i) => (i.selected = true));
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    deselectAll: (state) => {
      state.items.forEach((i) => (i.selected = false));
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    deleteSelected: (state) => {
      state.items = state.items.filter((i) => !i.selected);
      // localStorage.setItem("wish", JSON.stringify(state.items));
    },
    clearWish: (state) => {
      state.items = [];
      // localStorage.removeItem("wish");
    },
  },
});

export const {
  setWishItems,
  setLoading,
  setError,
  addItem,
  increment,
  decrement,
  removeItem,
  toggleSelectItem,
  selectAll,
  deselectAll,
  deleteSelected,
  clearWish,
} = wishSlice.actions;

export default wishSlice.reducer;

export const loadUserWish = () => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  dispatch(setLoading(true));
  try {
    const colRef = collection(db, "users", user.uid, "wish");
    const snapshot = await getDocs(colRef);

    const items: WishItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        product: data.product,
        quantity: data.quantity,
        selected: data.selected,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(), // ✅ number
      };
    });

    dispatch(setWishItems(items));
  } catch (err: any) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk: 위시 아이템 추가/업데이트
// export const saveWishItem = (product: Product) => async (dispatch: any) => {
//   const user = auth.currentUser;
//   if (!user) return;

//   const item: WishItem = {
//     product,
//     quantity: 1,
//     selected: false,
//   };

//   try {
//     const cleanProduct = Object.fromEntries(
//       Object.entries(product).filter(([_, value]) => value !== undefined)
//     );

//     const cleanItem = {
//       product: cleanProduct,
//       quantity: item.quantity,
//       selected: item.selected,
//       createdAt: new Date(),
//     };

//     const colRef = collection(db, "users", user.uid, "wish");
//     const q = query(colRef, where("product.id", "==", product.id));
//     const snapshot = await getDocs(q);

//     if (!snapshot.empty) {
//       // 이미 있으면 삭제 후 다시 추가하거나 수량 증가 (위시 특성상 중복 없애기)
//       const existingDoc = snapshot.docs[0];
//       await deleteDoc(doc(colRef, existingDoc.id));
//     }

//     await addDoc(colRef, {
//       ...item,
//       createdAt: new Date(),
//     });
//     dispatch(addItem(item));

//   } catch (err: any) {
//     console.log('실패',)
//     dispatch(setError(err.message));
//   }
// };
export const saveWishItem = (product: Product) => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // ✅ undefined 필드 제거 (Firestore 에러 방지)
    const cleanProduct = Object.fromEntries(
      Object.entries(product).filter(([_, v]) => v !== undefined)
    ) as Product;

    const colRef = collection(db, "users", user.uid, "wish");

    // 중복 제거
    const q = query(colRef, where("product.id", "==", product.id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }

    // ✅ Firestore 저장용
    const docRef = await addDoc(colRef, {
      product: cleanProduct,
      quantity: 1,
      selected: false,
      createdAt: serverTimestamp(), // Firestore 전용
    });

    // ✅ Redux 저장용 (직렬화 OK)
    dispatch(
      addItem({
        id: docRef.id,
        product: cleanProduct,
        quantity: 1,
        selected: false,
      })
    );
  } catch (err: any) {
    console.error("위시 추가 실패:", err);
    dispatch(setError(err.message));
  }
};

//수량 변경 시 Firestore 업데이트
export const updateWishQuantity =
  (productId: string, newQuantity: number) => async (dispatch: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const colRef = collection(db, "users", user.uid, "wish");
      const q = query(colRef, where("product.id", "==", productId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(colRef, docId), {
          quantity: newQuantity,
        });
        console.log("위시 수량 업데이트 성공:", productId, newQuantity);
      }
    } catch (err: any) {
      console.error("위시 수량 업데이트 실패:", err);
      dispatch(setError(err.message));
    }
  };

// Thunk: 위시 아이템 삭제
export const removeWishItem = (productId: string) => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const colRef = collection(db, "users", user.uid, "wish");
    const q = query(colRef, where("product.id", "==", productId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await deleteDoc(doc(colRef, docId));
      dispatch(removeItem(productId));
    }
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};

// 선택된 위시리스트 아이템 Firebase + Redux 삭제
export const deleteSelectedWishItems =
  () => async (dispatch: any, getState: any) => {
    const user = auth.currentUser;
    if (!user) return;

    const { wish } = getState();
    const selectedItems = wish.items.filter((item: any) => item.selected);

    if (selectedItems.length === 0) return;

    try {
      const colRef = collection(db, "users", user.uid, "wish");
      const batch = writeBatch(db);

      selectedItems.forEach((item: any) => {
        if (item.id) {
          const docRef = doc(colRef, item.id);
          batch.delete(docRef);
        }
      });

      await batch.commit();

      // Redux에서도 제거
      dispatch(deleteSelected());
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  };

// Thunk: 전체 위시리스트 삭제
export const clearUserWish = () => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const colRef = collection(db, "users", user.uid, "wish");
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    await batch.commit();
    dispatch(clearWish());
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};
