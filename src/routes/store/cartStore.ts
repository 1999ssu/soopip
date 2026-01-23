// src/routes/store/cartStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/features/cart/types/cart.types";
import { RootState } from "./index";
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

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

////////////////////////////////////////////////////////////
//1/19 주석 처리

// localStorage에서 초기값 불러오기

//const storedCart = localStorage.getItem("cart");

// const initialState: { items: CartItem[] } = {
//   items: storedCart ? JSON.parse(storedCart) : [],
// };
////////////////////////////////////////////////////////////

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ////////////////////////////////////////////////////////////////////////
    //1/19 추가
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    ////////////////////////////////////////////////////////////////////////
    // addItem: (state, action: PayloadAction<CartItem>) => {
    //   // 중복 체크: 기존에 있으면 quantity 증가
    //   const existing = state.items.find(
    //     (i) => i.product.id === action.payload.product.id
    //   );
    //   if (existing) {
    //     existing.quantity += action.payload.quantity;
    //   } else {
    //     state.items.push(action.payload);
    //   }
    //   //1.19 주석
    //   // localStorage.setItem("cart", JSON.stringify(state.items));
    // },

    addItem: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === payload.product.id
      );

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity = payload.quantity; // ← 여기서 = (덮어쓰기)
        state.items[existingIndex].selected =
          payload.selected ?? state.items[existingIndex].selected;
      } else {
        // 새 상품이면 추가
        state.items.push(payload);
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.selected = !item.selected;
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },
    selectAll: (state) => {
      state.items.forEach((i) => (i.selected = true));
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },
    deselectAll: (state) => {
      state.items.forEach((i) => (i.selected = false));
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },
    deleteSelected: (state) => {
      state.items = state.items.filter((i) => !i.selected);
      //1.19 주석
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },

    //1/19 주석
    // clearCart: (state) => {
    //   state.items = [];
    //   localStorage.removeItem("cart");
    // },
  },
});

export const {
  setCartItems,
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
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

//장바구니 뱃지 갯수 add
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

//1.19 추가
///////////////////////////////////////////////////////////////////////////////////////////
// Thunk: 로그인한 사용자 카트 불러오기
export const loadUserCart = () => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) {
    dispatch(setCartItems([])); // 비로그인 시 강제 초기화
    return;
  }

  try {
    const colRef = collection(db, "users", user.uid, "cart");
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return;
    }

    const items: CartItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        product: data.product,
        quantity: data.quantity,
        selected: false,
        createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
      };
    });

    dispatch(setCartItems(items));
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};

// Thunk: 카트 아이템 추가/업데이트
export const saveCartItem = (item: CartItem) => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const colRef = collection(db, "users", user.uid, "cart");
    const q = query(colRef, where("product.id", "==", item.product.id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // 기존 아이템 있으면 **덮어쓰기**
      const existingDoc = snapshot.docs[0];
      await updateDoc(doc(colRef, existingDoc.id), {
        quantity: item.quantity, // ← 새 수량으로 완전 교체
        selected: item.selected,
        updatedAt: new Date(),
      });
    } else {
      // 새 아이템 추가
      await addDoc(colRef, {
        ...item,
        createdAt: serverTimestamp(),
      });
    }

    // Redux에도 **덮어쓰기** 반영
    dispatch(addItem(item)); // ← addItem reducer가 덮어쓰기 로직이어야 함
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};

// Thunk: 카트 아이템 삭제
export const removeCartItem = (productId: string) => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const colRef = collection(db, "users", user.uid, "cart");
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
export const deleteSelectedCartItems =
  () => async (dispatch: any, getState: any) => {
    const user = auth.currentUser;
    if (!user) return;

    const { cart } = getState();
    const selectedItems = cart.items.filter((item: any) => item.selected);

    if (selectedItems.length === 0) return;

    try {
      const colRef = collection(db, "users", user.uid, "cart");
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

// Thunk: 전체 카트 초기화
export const clearUserCart = () => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const colRef = collection(db, "users", user.uid, "cart");
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    dispatch(clearCart());
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};
