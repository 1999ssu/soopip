// // src/features/checkout/components/CheckoutForm.tsx
// import { useState } from "react";

// interface CheckoutFormProps {
//   items: any[];
// }

// const CheckoutForm = ({ items }: CheckoutFormProps) => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     address: "",
//     phone: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !form.address) {
//       return alert("모든 정보를 입력해주세요.");
//     }

//     try {
//       const res = await fetch(
//         "https://us-central1-soopip.cloudfunctions.net/createCheckoutSession",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user: form,
//             items,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!data.url) throw new Error("결제 URL 없음");

//       window.location.href = data.url;
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <input
//         name="name"
//         placeholder="Full Name"
//         value={form.name}
//         onChange={handleChange}
//         className="border p-2"
//       />
//       <input
//         name="email"
//         placeholder="Email"
//         value={form.email}
//         onChange={handleChange}
//         className="border p-2"
//       />
//       <input
//         name="address"
//         placeholder="Address"
//         value={form.address}
//         onChange={handleChange}
//         className="border p-2"
//       />
//       <input
//         name="phone"
//         placeholder="Phone (Optional)"
//         value={form.phone}
//         onChange={handleChange}
//         className="border p-2"
//       />

//       <button
//         className="bg-black text-white p-3 rounded"
//         onClick={handleSubmit}
//       >
//         결제 진행하기
//       </button>
//     </div>
//   );
// };

// export default CheckoutForm;
