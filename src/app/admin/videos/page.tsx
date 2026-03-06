'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Film, Trash2, Play, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  fileName: string;
  uploadedAt: Date;
}

export default function AdminVideos() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 🔥 FUNÇÃO PARA CARREGAR VÍDEOS DO BANCO
  const loadVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/api/videos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Converter para o formato esperado
        const formattedVideos = data.map((video: any) => ({
          id: video.id.toString(),
          title: video.title,
          description: video.description,
          url: video.url,
          fileName: video.url.split('/').pop() || '',
          uploadedAt: new Date(video.created_at || Date.now())
        }));
        setVideos(formattedVideos);
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    }
  };

  // Carregar vídeos ao iniciar
  useEffect(() => {
    loadVideos();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é MP4
    if (!file.type.includes('mp4')) {
      alert('Por favor, selecione um arquivo MP4');
      return;
    }

    // Verificar tamanho (máx 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 100MB');
      return;
    }

    setSelectedFile(file);
    
    // Criar preview do vídeo
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.title) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('video', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      // ✅ Upload direto para o Laravel (URL CORRETA)
      const res = await fetch('http://127.0.0.1:8000/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // ❌ NÃO colocar Content-Type aqui! O navegador define automaticamente com boundary
        },
        body: formDataToSend
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro no upload');
      }

      setUploadProgress(100);
      alert('✅ Vídeo enviado e cadastrado com sucesso!');
      
      // Limpar formulário
      setFormData({ title: '', description: '' });
      setSelectedFile(null);
      setPreview(null);
      
      // Recarregar lista
      await loadVideos();
      
    } catch (error: any) {
      alert('Erro: ' + error.message);
      console.error('Detalhes:', error);
    } finally {
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Vídeo excluído com sucesso!');
        await loadVideos();
      } else {
        const data = await res.json();
        alert(data.message || 'Erro ao excluir vídeo');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir vídeo');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Vídeos</h1>

      {/* Formulário de Upload */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload size={20} />
          Enviar Novo Vídeo
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Área de upload do arquivo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            {preview ? (
              <div className="relative">
                <video 
                  src={preview} 
                  controls 
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".mp4,video/mp4"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <Film size={48} className="text-gray-400 mb-2" />
                  <span className="text-blue-600 hover:underline">
                    Clique para selecionar um vídeo MP4
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    ou arraste e solte aqui
                  </span>
                  <span className="text-xs text-gray-400 mt-2">
                    Máximo: 100MB
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Campos do formulário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do vídeo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Aula 1 - Introdução"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Descreva o conteúdo do vídeo..."
            />
          </div>

          {/* Barra de progresso */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enviando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            {uploading ? 'Enviando...' : 'Enviar Vídeo'}
          </button>
        </form>
      </div>

      {/* Lista de Vídeos */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Vídeos Enviados</h2>

        {videos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Film size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum vídeo enviado ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="relative group">
                  <video 
                    src={`http://127.0.0.1:8000${video.url}`}
                    className="w-full h-48 object-cover bg-black"
                    controls
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(`http://127.0.0.1:8000${video.url}`, '_blank')}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Assistir"
                    >
                      <Play size={20} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Excluir"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  <p className="text-xs text-gray-400">
                    Enviado em {new Date(video.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}