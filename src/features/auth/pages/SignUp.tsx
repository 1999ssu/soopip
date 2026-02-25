import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function SignUp() {
  const { signUp, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(name, email, password);
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-center  ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">SIGN UP</h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full p-2 mb-3"
          required
        />

        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2 mb-3"
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#852623] text-[#f5f6dc] w-full py-2 rounded hover:bg-[#852623]"
        >
          {loading ? "회원가입 중..." : "CREATE ACCOUNT"}
        </button>

        {/* <div className="text-sm text-center mt-3">
          <Link to="/login" className="text-blue-500 hover:underline">
            로그인으로 이동
          </Link>
        </div> */}
      </form>
    </div>
  );
}
