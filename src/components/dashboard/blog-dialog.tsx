'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, CheckCircle2, FileText, Eye, EyeOff, Star, StarOff } from 'lucide-react'
import { createPostBlog, updatePostBlog } from '@/app/actions/blog'

type Post = {
    id: string
    titulo: string
    slug: string
    descricao_curta?: string
    conteudo: string
    imagem_capa?: string
    autor?: string
    categoria?: string
    tags?: string[]
    is_publicado: boolean
    is_destaque: boolean
    data_publicacao?: string
}

type BlogDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    post?: Post | null
    onSuccess: () => void
}

const CATEGORIAS = [
    'Dicas de Ballet',
    'Eventos',
    'Notícias',
    'Bastidores',
    'Dança Contemporânea',
    'Saúde e Bem-estar',
    'Figurinos',
    'Metodologia',
]

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export function BlogDialog({ open, onOpenChange, post, onSuccess }: BlogDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        titulo: '',
        slug: '',
        descricao_curta: '',
        conteudo: '',
        imagem_capa: '',
        categoria: '',
        tags: '',
        is_publicado: false,
        is_destaque: false,
    })

    useEffect(() => {
        if (post) {
            setFormData({
                titulo: post.titulo || '',
                slug: post.slug || '',
                descricao_curta: post.descricao_curta || '',
                conteudo: post.conteudo || '',
                imagem_capa: post.imagem_capa || '',
                categoria: post.categoria || '',
                tags: post.tags?.join(', ') || '',
                is_publicado: post.is_publicado || false,
                is_destaque: post.is_destaque || false,
            })
        } else {
            setFormData({
                titulo: '',
                slug: '',
                descricao_curta: '',
                conteudo: '',
                imagem_capa: '',
                categoria: '',
                tags: '',
                is_publicado: false,
                is_destaque: false,
            })
        }
        setError(null)
        setSuccess(false)
    }, [post, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const payload = {
                titulo: formData.titulo,
                slug: formData.slug || generateSlug(formData.titulo),
                descricao_curta: formData.descricao_curta || undefined,
                conteudo: formData.conteudo,
                imagem_capa: formData.imagem_capa || undefined,
                categoria: formData.categoria || undefined,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
                is_publicado: formData.is_publicado,
                is_destaque: formData.is_destaque,
                data_publicacao: formData.is_publicado ? new Date().toISOString() : undefined,
            }

            if (post) {
                await updatePostBlog(post.id, payload)
            } else {
                await createPostBlog(payload)
            }

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                onOpenChange(false)
            }, 1000)

        } catch (err) {
            console.error('Erro ao salvar post:', err)
            setError(err instanceof Error ? err.message : 'Erro ao salvar post')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Auto-generate slug when title changes (only for new posts)
        if (field === 'titulo' && !post && typeof value === 'string') {
            setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-pink-500" />
                        {post ? 'Editar Post' : 'Novo Post do Blog'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        {post
                            ? 'Atualize as informações do post abaixo.'
                            : 'Crie um novo post para o blog do site.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-300 leading-relaxed">
                                {post ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!'}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="titulo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Título *
                        </Label>
                        <Input
                            id="titulo"
                            value={formData.titulo}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            placeholder="Ex: A Importância do Aquecimento no Ballet"
                            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            required
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Slug (URL) *
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                placeholder="importancia-aquecimento-ballet"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-mono text-sm"
                                required
                                disabled={isLoading || success}
                            />
                            <p className="text-xs text-zinc-500">URL: /blog/{formData.slug || 'seu-post'}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoria" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Categoria
                            </Label>
                            <select
                                id="categoria"
                                value={formData.categoria}
                                onChange={(e) => handleChange('categoria', e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                disabled={isLoading || success}
                            >
                                <option value="">Selecione...</option>
                                {CATEGORIAS.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descricao_curta" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Descrição Curta
                        </Label>
                        <Input
                            id="descricao_curta"
                            value={formData.descricao_curta}
                            onChange={(e) => handleChange('descricao_curta', e.target.value)}
                            placeholder="Uma breve descrição que aparece na listagem..."
                            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="conteudo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Conteúdo *
                        </Label>
                        <textarea
                            id="conteudo"
                            value={formData.conteudo}
                            onChange={(e) => handleChange('conteudo', e.target.value)}
                            placeholder="Escreva o conteúdo do post aqui..."
                            rows={8}
                            className="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-y"
                            required
                            disabled={isLoading || success}
                        />
                        <p className="text-xs text-zinc-500">Suporta markdown para formatação</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="imagem_capa" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                URL da Imagem de Capa
                            </Label>
                            <Input
                                id="imagem_capa"
                                type="url"
                                value={formData.imagem_capa}
                                onChange={(e) => handleChange('imagem_capa', e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Tags (separadas por vírgula)
                            </Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => handleChange('tags', e.target.value)}
                                placeholder="ballet, dicas, iniciantes"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={() => handleChange('is_publicado', !formData.is_publicado)}
                            disabled={isLoading || success}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                formData.is_publicado
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                        >
                            {formData.is_publicado ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {formData.is_publicado ? 'Publicado' : 'Rascunho'}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleChange('is_destaque', !formData.is_destaque)}
                            disabled={isLoading || success}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                formData.is_destaque
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                        >
                            {formData.is_destaque ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {formData.is_destaque ? 'Em Destaque' : 'Normal'}
                            </span>
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                            <strong>Dica:</strong> Posts em &quot;Rascunho&quot; não aparecem no site público.
                            Marque como &quot;Publicado&quot; quando estiver pronto para divulgar.
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading || success}
                            className="border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || success}
                            className="bg-pink-600 hover:bg-pink-500 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Salvo!
                                </>
                            ) : (
                                post ? 'Atualizar Post' : 'Criar Post'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
