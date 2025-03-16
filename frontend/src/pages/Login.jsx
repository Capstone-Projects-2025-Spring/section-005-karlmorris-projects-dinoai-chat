import loginBg from "../assets/LoginBackground2.jpg";

export default function Login() {
  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Background Image with Gray Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      >
        {/* Gray Overlay */}
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      </div>

      {/* Login Box (Above Background) */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full">
            Login
          </button>
          <div className="text-center mt-4 text-gray-500">
            <a href="/signup" className="text-gray-500 hover:underline">Or sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}
