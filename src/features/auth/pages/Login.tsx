import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Login() {
  const { user, login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // 로그인 상태면 홈으로
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/"); // 로그인 성공하면 홈으로 이동
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-80"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">로그인</h1>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
        <div className="text-sm text-center mt-3">
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
          <Link to="/reset" className="text-blue-500 hover:underline">
            비밀번호 재설정
          </Link>
        </div>
      </form>
    </div>
  );
}
