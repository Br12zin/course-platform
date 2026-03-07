export async function uploadVideo(formData: FormData) {

  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro no upload");
  }

  return res.json();
}