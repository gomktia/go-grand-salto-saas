'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Bell, CheckCircle2, Loader2, Send, Smartphone } from 'lucide-react'
import { enviarNotificacaoGrupo } from '@/app/actions/admin'
import { toast } from 'sonner'

interface NotificacaoTurmaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    turmaId: string
    turmaNome: string
}

export function NotificacaoTurmaDialog({
    open,
    onOpenChange,
    turmaId,
    turmaNome
}: NotificacaoTurmaDialogProps) {
    const [isSending, setIsSending] = useState(false)
    const [title, setTitle] = useState('Comunicado Importante')
    const [message, setMessage] = useState('')

    async function handleSend() {
        if (!message || !title) {
            toast.error('Título e mensagem são obrigatórios')
            return
        }

        setIsSending(true)
        try {
            await enviarNotificacaoGrupo({
                titulo: title,
                mensagem: message,
                tipo: 'geral',
                grupo: 'turma',
                turma_id: turmaId
            })

            toast.success('Notificação enviada com sucesso para a turma!')
            onOpenChange(false)
            setMessage('')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao enviar notificação')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                        <Bell className="w-5 h-5 text-rose-500" />
                        Enviar Notificação
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Sua mensagem será enviada para todos os responsáveis da turma <strong>{turmaNome}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => toast.info('Integração com WhatsApp será liberada em breve.')}
                            className="h-10 rounded-xl text-xs font-bold gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 border-emerald-600/20"
                        >
                            <Send className="w-3.5 h-3.5" /> WhatsApp
                        </Button>
                        <Button
                            className="h-10 rounded-xl text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg shadow-rose-500/20"
                        >
                            <Smartphone className="w-3.5 h-3.5" /> App Push
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assunto</label>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Lembrete de Aula"
                            className="bg-muted/40 border-none rounded-xl h-11 text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mensagem</label>
                        <Textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Escreva sua mensagem aqui..."
                            className="min-h-[120px] bg-muted/40 border-none rounded-xl p-4 text-sm font-medium resize-none shadow-inner"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSend}
                        disabled={isSending}
                        className="w-full h-11 rounded-xl font-bold text-xs shadow-md gap-2 text-white bg-rose-600 hover:bg-rose-500 border-none"
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <><CheckCircle2 size={16} /> Enviar Notificação</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
