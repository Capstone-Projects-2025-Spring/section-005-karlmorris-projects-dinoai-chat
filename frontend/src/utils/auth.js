export const checkAuthWithBackend = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
  
    try {
      const res = await fetch("http://localhost:8080/auth/me", {
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
  