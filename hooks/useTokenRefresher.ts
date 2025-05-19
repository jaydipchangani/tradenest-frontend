// src/hooks/useTokenRefresher.ts
import { useEffect } from "react";
import { refreshToken } from "../api/authApi";

export function useTokenRefresher() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(tryRefreshToken, 20 * 60 * 1000); // 20 min
    };

    const tryRefreshToken = async () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("refreshToken");
      if (!email || !token) return;

      try {
        const data = await refreshToken(email, token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log("Token refreshed");
      } catch (error) {
        console.warn("Token refresh failed", error);
        // optionally redirect to login
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    handleActivity(); // Start immediately

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(timeoutId);
    };
  }, []);
}
