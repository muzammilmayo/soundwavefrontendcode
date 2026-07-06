// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import authService from "../../services/authService";
// import "./register.css";

// export default function SuperAdminRegister() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role_id: 1,
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const register = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await authService.register(form);
//       alert(res.message);
//       navigate("/SuperAdmin/login");
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration Failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">

//         <h1 className="logo">👑 Super Admin</h1>

//         <h2>Create Super Admin Account</h2>

//         <form className="auth-form" onSubmit={register}>

//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={form.username}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit">
//             Create Account
//           </button>

//         </form>

//         <p className="auth-text">
//           Already have an account?
//           <Link to="/SuperAdmin/login"> Login</Link>
//         </p>

//       </div>
//     </div>
//   );
// }