// src/store/addressSlice.ts
import { auth, db } from "@/lib/firebase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export interface Address {
  id: string;
  info: { firstName: string; lastName: string; phoneNum: string };
  address: { address: string; city: string; state: string; postalCode: string };
  detail: string;
  placeId?: string;
  isDefault?: boolean;
}

interface AddressState {
  addresses: Address[];
  defaultAddressId: string | null; // 영구 기본 배송지
  selectedAddressId: string | null; // 라디오 임시 선택
  confirmedAddressId: string | null; // Save 눌렀을 때 확정된 주소

  //1/19 추가
  loading: boolean;
  error: string | null;
}

//1.19 주석
///////////////
// const loadInitialState = (): AddressState => {
//   const saved = localStorage.getItem("address");
//   if (saved) {
//     try {
//       return JSON.parse(saved);
//     } catch {
//       return {
//         addresses: [],
//         defaultAddressId: null,
//         selectedAddressId: null,
//         confirmedAddressId: null,

//         //1/19 추가
//         loading: false,
//         error: null,
//       };
//     }
//   }
//   return {
//     addresses: [],
//     defaultAddressId: null,
//     selectedAddressId: null,
//     confirmedAddressId: null,

//     //1/19 추가
//     loading: false,
//     error: null,
//   };
// };

// const initialState: AddressState = loadInitialState();

const initialState: AddressState = {
  addresses: [],
  defaultAddressId: null,
  selectedAddressId: null,
  confirmedAddressId: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    //1/19 추가
    //////////////////////////////////////////
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    //////////////////////////////////////////
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
      // 첫 주소면 자동 설정
      if (state.addresses.length === 1) {
        state.defaultAddressId = action.payload.id;
        state.selectedAddressId = action.payload.id;
        state.confirmedAddressId = action.payload.id;
      }
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);

      // 삭제된 주소가 관련 ID였으면 초기화
      if (state.defaultAddressId === action.payload) {
        state.defaultAddressId = state.addresses[0]?.id || null;
      }
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId =
          state.defaultAddressId || state.addresses[0]?.id || null;
      }
      if (state.confirmedAddressId === action.payload) {
        state.confirmedAddressId =
          state.defaultAddressId || state.addresses[0]?.id || null;
      }
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.defaultAddressId = action.payload;
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
    confirmAddress: (state) => {
      state.confirmedAddressId =
        state.selectedAddressId ||
        state.defaultAddressId ||
        state.addresses[0]?.id ||
        null;
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.defaultAddressId = null;
      state.selectedAddressId = null;
      state.confirmedAddressId = null;
      //1.19 주석
      // localStorage.setItem("address", JSON.stringify(state));
    },
  },
});

export const {
  setLoading,
  setError,

  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  setSelectedAddress,
  confirmAddress,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;

export const loadUserAddresses = () => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  dispatch(setLoading(true));
  try {
    const colRef = collection(db, "users", user.uid, "addresses");
    const snapshot = await getDocs(colRef);
    const addresses = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Address)
    );
    dispatch(setAddresses(addresses));

    // 기본 주소 자동 설정
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    if (defaultAddr) {
      dispatch(setDefaultAddress(defaultAddr.id));
      dispatch(setSelectedAddress(defaultAddr.id));
      dispatch(confirmAddress());
    }
  } catch (err: any) {
    console.log("err:", setError(err.message));
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const saveAddress =
  (address: Omit<Address, "id">, isDefault: boolean) =>
  async (dispatch: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const colRef = collection(db, "users", user.uid, "addresses");
      const docRef = await addDoc(colRef, {
        ...address,
        isDefault,
        createdAt: new Date(),
      });

      const newAddress = { ...address, id: docRef.id, isDefault };
      dispatch(addAddress(newAddress));

      //1.19 추가
      dispatch(addAddress(newAddress));
      ////////////////////////////////////////////
      if (isDefault) {
        dispatch(setDefaultAddress(docRef.id));
      }
    } catch (err: any) {
      console.log("err11:", setError(err.message));
      dispatch(setError(err.message));
    }
  };

// 수정 (update)
export const updateUserAddress =
  (address: Address, isDefault: boolean) => async (dispatch: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const addrDoc = doc(db, "users", user.uid, "addresses", address.id);
      await updateDoc(addrDoc, {
        ...address,
        isDefault,
      });

      dispatch(updateAddress({ ...address, isDefault }));
      if (isDefault) {
        dispatch(setDefaultAddress(address.id));
      }
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  };

// 삭제
export const deleteUserAddress = (id: string) => async (dispatch: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const addrDoc = doc(db, "users", user.uid, "addresses", id);
    await deleteDoc(addrDoc);
    dispatch(deleteAddress(id));
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};
