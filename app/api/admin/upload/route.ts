import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  if (!(await isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    // Valida tipo — whitelist explícita, sem SVG (pode conter JS)
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Formato não suportado. Use JPG, PNG, WebP ou GIF.' }, { status: 400 })
    }

    // Valida extensão real do arquivo (defesa em profundidade)
    const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    const rawExt = (file.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXTS.includes(rawExt)) {
      return NextResponse.json({ error: 'Extensão de arquivo não permitida.' }, { status: 400 })
    }

    // Valida tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem deve ter no máximo 5MB' }, { status: 400 })
    }

    const ext = rawExt || 'jpg'
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
