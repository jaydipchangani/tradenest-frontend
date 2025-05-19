
export async function refreshToken(email: string, refreshToken: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, refreshToken }),
    });
  
    if (!res.ok) throw new Error("Failed to refresh token");
  
    return await res.json(); 
  }
  