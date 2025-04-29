export const checkAuthWithBackend = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) return false;
  
      const data = await res.json();
      return data?.username != null;
    } catch (err) {
      return false;
    }
  };
