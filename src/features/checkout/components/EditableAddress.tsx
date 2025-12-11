// import React from "react";
// import { Field, FieldLabel } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { SelectedPlace } from "../types/types";
// import { canadianProvinces } from "../types/constants";

// interface EditableAddressProps {
//   editableAddress: {
//     address: string;
//     city: string;
//     state: string;
//     zip: string;
//   };
//   handleEditableChange: (
//     field: "address" | "city" | "state" | "zip",
//     value: string
//   ) => void;
//   selected: SelectedPlace;
// }

// export const EditableAddress: React.FC<EditableAddressProps> = ({
//   editableAddress,
//   handleEditableChange,
//   selected,
// }) => {
//   if (!selected) return null;

//   return (
//     <div>
//       <Field>
//         <FieldLabel>Address</FieldLabel>
//         <Input
//           placeholder="Enter your address."
//           value={editableAddress.address}
//           onChange={(e) => handleEditableChange("address", e.target.value)}
//           required
//         />
//       </Field>
//       <Field>
//         <FieldLabel>City</FieldLabel>
//         <Input
//           placeholder="Enter your city."
//           value={editableAddress.city}
//           onChange={(e) => handleEditableChange("city", e.target.value)}
//           required
//         />
//       </Field>
//       <Field>
//         <FieldLabel>State</FieldLabel>
//         <Select
//           value={editableAddress.state || ""}
//           onValueChange={(val) => handleEditableChange("state", val)}
//         >
//           <SelectTrigger id="checkout-state">
//             <SelectValue placeholder="Select state" />
//           </SelectTrigger>
//           <SelectContent>
//             {canadianProvinces.map((prov) => (
//               <SelectItem key={prov.code} value={prov.name}>
//                 {prov.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </Field>
//       <Field>
//         <FieldLabel>Zip code</FieldLabel>
//         <Input
//           placeholder="Enter your zip code."
//           value={editableAddress.zip || ""}
//           onChange={(e) => handleEditableChange("zip", e.target.value)}
//           required
//         />
//       </Field>
//     </div>
//   );
// };
