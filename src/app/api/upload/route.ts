import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verificar se é MP4
    if (!file.type.includes('mp4')) {
      return NextResponse.json(
        { error: 'Apenas arquivos MP4 são permitidos' },
        { status: 400 }
      );
    }

    // Criar pasta de uploads se não existir
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    // Converter file para buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL pública do vídeo
    const videoUrl = `/uploads/${fileName}`;

    // Aqui você salvaria no banco de dados as informações do vídeo
    // Por enquanto só retornamos a URL

    return NextResponse.json({
      success: true,
      video: {
        url: videoUrl,
        title,
        description,
        fileName
      }
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}