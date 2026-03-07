"use client";

import { useState } from "react";
import { uploadVideo } from "@/lib/adminVideos";

export default function UploadVideoPage() {

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [file,setFile] = useState<File | null>(null);
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    if(!file){
      alert("Selecione um vídeo");
      return;
    }

    const formData = new FormData();

    formData.append("title",title);
    formData.append("description",description);
    formData.append("video",file);

    try{

      setLoading(true);

      await uploadVideo(formData);

      alert("Vídeo enviado com sucesso!");

      setTitle("");
      setDescription("");
      setFile(null);

    }catch(err){

      console.error(err);
      alert("Erro no upload");

    }finally{

      setLoading(false);

    }

  };

  return(

    <div className="max-w-xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Upload de Vídeo
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="file"
          accept="video/mp4"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Enviando..." : "Enviar vídeo"}
        </button>

      </form>

    </div>

  );

}