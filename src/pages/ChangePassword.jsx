// import { useState } from "react";
// import authService from "../services/authService";
// import "./changePassword.css";

// export default function ChangePassword() {
//   const [password, setPassword] = useState({
//     currentPassword: "",
//     newPassword: "",
//   });

//   const handleChange = (e) => {
//     setPassword({
//       ...password,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const changePassword = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await authService.changePassword(password);
//       alert(res.message);

//       setPassword({
//         currentPassword: "",
//         newPassword: "",
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="change-container">
//       <form className="change-form" onSubmit={changePassword}>
//         <h2>🔒 Change Password</h2>

//         <input
//           type="password"
//           name="currentPassword"
//           placeholder="Current Password"
//           value={password.currentPassword}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="newPassword"
//           placeholder="New Password"
//           value={password.newPassword}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">
//           Update Password
//         </button>
//       </form>
//     </div>
//   );
// }