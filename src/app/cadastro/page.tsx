'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Sparkles,
    Building2,
    User,
    CreditCard,
    Check,
    ChevronRight,
    ChevronLeft,
    Loader2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Lock,
    FileText,
    Zap,
    Crown,
    Rocket,
    Users,
    Camera,
    Calendar,
    BarChart3,
    Headphones,
    Shield,
    Star
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { cadastrarEscola } from '@/app/actions/cadastro-escola'

// Definição dos planos
const planos = [
    {
        id: 'starter',
        nome: 'Starter',
        preco: 97,
        precoAnual: 970,
        descricao: 'Para escolas iniciando sua jornada digital',
        icon: Zap,
        cor: 'neutral',
        popular: false,
        recursos: [
            'Até 50 alunos',
            'Até 3 turmas',
            '1 usuário administrador',
            'Site institucional básico',
            'Galeria de fotos (até 500 fotos)',
            'Agenda de aulas',
            'Suporte por email',
        ],
        limites: {
            alunos: 50,
            turmas: 3,
            usuarios: 1,
            fotos: 500
        }
    },
    {
        id: 'professional',
        nome: 'Professional',
        preco: 197,
        precoAnual: 1970,
        descricao: 'Para escolas em crescimento',
        icon: Crown,
        cor: 'amber',
        popular: true,
        recursos: [
            'Até 200 alunos',
            'Até 15 turmas',
            '5 usuários administradores',
            'Site premium personalizado',
            'Galeria ilimitada de fotos',
            'Venda de fotos integrada',
            'Blog com IA para SEO',
            'Gestão financeira completa',
            'Estoque de figurinos',
            'Métricas corporais dos alunos',
            'Notificações WhatsApp',
            'Suporte prioritário',
        ],
        limites: {
            alunos: 200,
            turmas: 15,
            usuarios: 5,
            fotos: -1 // ilimitado
        }
    },
    {
        id: 'enterprise',
        nome: 'Enterprise',
        preco: 397,
        precoAnual: 3970,
        descricao: 'Para redes de escolas e grandes operações',
        icon: Rocket,
        cor: 'violet',
        popular: false,
        recursos: [
            'Alunos ilimitados',
            'Turmas ilimitadas',
            'Usuários ilimitados',
            'Múltiplas unidades/filiais',
            'Domínio personalizado',
            'API de integração',
            'Relatórios avançados',
            'Reconhecimento facial (check-in)',
            'App mobile white-label',
            'Gerente de conta dedicado',
            'Suporte 24/7',
            'Treinamento personalizado',
        ],
        limites: {
            alunos: -1,
            turmas: -1,
            usuarios: -1,
            fotos: -1
        }
    }
]

interface FormData {
    // Dados da escola
    nomeFantasia: string
    razaoSocial: string
    cnpj: string
    inscricaoEstadual: string
    inscricaoMunicipal: string

    // Endereço
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string

    // Contato
    telefone: string
    whatsapp: string
    emailEscola: string
    website: string

    // Responsável
    nomeResponsavel: string
    cpfResponsavel: string
    emailResponsavel: string
    telefoneResponsavel: string

    // Acesso
    senha: string
    confirmarSenha: string

    // Plano
    planoSelecionado: string
    periodoCobranca: 'mensal' | 'anual'
}

const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

function CadastroContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [buscandoCep, setBuscandoCep] = useState(false)

    // Pegar plano da URL se existir
    const planoUrl = searchParams.get('plano')
    const planoInicial = planoUrl && ['starter', 'professional', 'enterprise'].includes(planoUrl)
        ? planoUrl
        : 'professional'

    const [formData, setFormData] = useState<FormData>({
        nomeFantasia: '',
        razaoSocial: '',
        cnpj: '',
        inscricaoEstadual: '',
        inscricaoMunicipal: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        telefone: '',
        whatsapp: '',
        emailEscola: '',
        website: '',
        nomeResponsavel: '',
        cpfResponsavel: '',
        emailResponsavel: '',
        telefoneResponsavel: '',
        senha: '',
        confirmarSenha: '',
        planoSelecionado: planoInicial,
        periodoCobranca: 'mensal'
    })

    const totalSteps = 5

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Formatação de CNPJ
    const formatCNPJ = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18)
    }

    // Formatação de CPF
    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14)
    }

    // Formatação de CEP
    const formatCEP = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 9)
    }

    // Formatação de telefone
    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15)
    }

    // Buscar CEP
    const buscarCEP = async (cep: string) => {
        const cepLimpo = cep.replace(/\D/g, '')
        if (cepLimpo.length !== 8) return

        setBuscandoCep(true)
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            const data = await response.json()

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    logradouro: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    estado: data.uf || ''
                }))
            }
        } catch {
            toast.error('Erro ao buscar CEP')
        } finally {
            setBuscandoCep(false)
        }
    }

    // Validações por step
    const validateStep = (currentStep: number): boolean => {
        switch (currentStep) {
            case 1: // Plano
                return !!formData.planoSelecionado
            case 2: // Dados da empresa
                if (!formData.nomeFantasia.trim()) {
                    toast.error('Nome fantasia é obrigatório')
                    return false
                }
                if (!formData.razaoSocial.trim()) {
                    toast.error('Razão social é obrigatória')
                    return false
                }
                if (!formData.cnpj || formData.cnpj.replace(/\D/g, '').length !== 14) {
                    toast.error('CNPJ inválido')
                    return false
                }
                return true
            case 3: // Endereço
                if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
                    toast.error('CEP inválido')
                    return false
                }
                if (!formData.logradouro.trim()) {
                    toast.error('Logradouro é obrigatório')
                    return false
                }
                if (!formData.numero.trim()) {
                    toast.error('Número é obrigatório')
                    return false
                }
                if (!formData.cidade.trim()) {
                    toast.error('Cidade é obrigatória')
                    return false
                }
                if (!formData.estado) {
                    toast.error('Estado é obrigatório')
                    return false
                }
                return true
            case 4: // Responsável
                if (!formData.nomeResponsavel.trim()) {
                    toast.error('Nome do responsável é obrigatório')
                    return false
                }
                if (!formData.cpfResponsavel || formData.cpfResponsavel.replace(/\D/g, '').length !== 11) {
                    toast.error('CPF inválido')
                    return false
                }
                if (!formData.emailResponsavel.trim() || !formData.emailResponsavel.includes('@')) {
                    toast.error('Email do responsável inválido')
                    return false
                }
                if (!formData.telefoneResponsavel || formData.telefoneResponsavel.replace(/\D/g, '').length < 10) {
                    toast.error('Telefone do responsável inválido')
                    return false
                }
                return true
            case 5: // Senha
                if (!formData.senha || formData.senha.length < 8) {
                    toast.error('Senha deve ter no mínimo 8 caracteres')
                    return false
                }
                if (formData.senha !== formData.confirmarSenha) {
                    toast.error('As senhas não coincidem')
                    return false
                }
                return true
            default:
                return true
        }
    }

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, totalSteps))
        }
    }

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(5)) return

        setLoading(true)
        try {
            const result = await cadastrarEscola({
                nomeFantasia: formData.nomeFantasia,
                razaoSocial: formData.razaoSocial,
                cnpj: formData.cnpj.replace(/\D/g, ''),
                inscricaoEstadual: formData.inscricaoEstadual,
                inscricaoMunicipal: formData.inscricaoMunicipal,
                cep: formData.cep.replace(/\D/g, ''),
                logradouro: formData.logradouro,
                numero: formData.numero,
                complemento: formData.complemento,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
                telefone: formData.telefone.replace(/\D/g, ''),
                whatsapp: formData.whatsapp.replace(/\D/g, ''),
                emailEscola: formData.emailEscola,
                website: formData.website,
                nomeResponsavel: formData.nomeResponsavel,
                cpfResponsavel: formData.cpfResponsavel.replace(/\D/g, ''),
                emailResponsavel: formData.emailResponsavel,
                telefoneResponsavel: formData.telefoneResponsavel.replace(/\D/g, ''),
                senha: formData.senha,
                plano: formData.planoSelecionado,
                periodoCobranca: formData.periodoCobranca
            })

            if (result.success) {
                toast.success('Escola cadastrada com sucesso!')
                router.push(`/cadastro/sucesso?escola=${result.slug}&email=${formData.emailResponsavel}`)
            } else {
                toast.error(result.error || 'Erro ao cadastrar escola')
            }
        } catch {
            toast.error('Erro ao processar cadastro')
        } finally {
            setLoading(false)
        }
    }

    const planoSelecionado = planos.find(p => p.id === formData.planoSelecionado)

    // Gerar slug da escola
    const gerarSlug = (nome: string) => {
        return nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const slugEscola = gerarSlug(formData.nomeFantasia)

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                            <Sparkles className="text-black w-5 h-5" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">Grand Salto<span className="text-amber-400">.IA</span></span>
                    </Link>

                    <Link href="/login">
                        <Button variant="ghost" className="text-neutral-400 hover:text-white">
                            Já tenho conta
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    {/* Progress Bar */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="flex items-center justify-between mb-4">
                            {[
                                { num: 1, label: 'Plano', icon: CreditCard },
                                { num: 2, label: 'Empresa', icon: Building2 },
                                { num: 3, label: 'Endereço', icon: MapPin },
                                { num: 4, label: 'Responsável', icon: User },
                                { num: 5, label: 'Acesso', icon: Lock }
                            ].map((s, i) => (
                                <React.Fragment key={s.num}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                            step >= s.num
                                                ? 'bg-amber-500 text-black'
                                                : 'bg-neutral-800 text-neutral-500'
                                        }`}>
                                            {step > s.num ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <s.icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className={`text-xs mt-2 ${step >= s.num ? 'text-white' : 'text-neutral-500'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < 4 && (
                                        <div className={`flex-1 h-0.5 mx-2 ${
                                            step > s.num ? 'bg-amber-500' : 'bg-neutral-800'
                                        }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Escolha do Plano */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-10">
                                        <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
                                        <p className="text-neutral-400">
                                            Comece com 7 dias grátis. Cancele quando quiser.
                                        </p>
                                    </div>

                                    {/* Toggle Mensal/Anual */}
                                    <div className="flex items-center justify-center gap-4 mb-10">
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, periodoCobranca: 'mensal' }))}
                                            className={`px-6 py-2 rounded-full transition-all ${
                                                formData.periodoCobranca === 'mensal'
                                                    ? 'bg-white text-black font-bold'
                                                    : 'text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            Mensal
                                        </button>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, periodoCobranca: 'anual' }))}
                                            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                                                formData.periodoCobranca === 'anual'
                                                    ? 'bg-white text-black font-bold'
                                                    : 'text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            Anual
                                            <Badge className="bg-green-500/20 text-green-400 text-xs">-17%</Badge>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {planos.map((plano) => {
                                            const Icon = plano.icon
                                            const isSelected = formData.planoSelecionado === plano.id
                                            const preco = formData.periodoCobranca === 'anual'
                                                ? Math.round(plano.precoAnual / 12)
                                                : plano.preco

                                            return (
                                                <Card
                                                    key={plano.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, planoSelecionado: plano.id }))}
                                                    className={`relative p-6 cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'bg-amber-500/10 border-amber-500'
                                                            : 'bg-neutral-900/50 border-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    {plano.popular && (
                                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold">
                                                            Mais Popular
                                                        </Badge>
                                                    )}

                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                            plano.cor === 'amber' ? 'bg-amber-500/20 text-amber-500' :
                                                            plano.cor === 'violet' ? 'bg-violet-500/20 text-violet-500' :
                                                            'bg-neutral-800 text-neutral-400'
                                                        }`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg">{plano.nome}</h3>
                                                        </div>
                                                    </div>

                                                    <p className="text-neutral-400 text-sm mb-4">{plano.descricao}</p>

                                                    <div className="mb-6">
                                                        <span className="text-4xl font-bold">R$ {preco}</span>
                                                        <span className="text-neutral-400">/mês</span>
                                                        {formData.periodoCobranca === 'anual' && (
                                                            <p className="text-sm text-green-400 mt-1">
                                                                Cobrado R$ {plano.precoAnual}/ano
                                                            </p>
                                                        )}
                                                    </div>

                                                    <ul className="space-y-2">
                                                        {plano.recursos.map((recurso, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                                                    plano.cor === 'amber' ? 'text-amber-500' :
                                                                    plano.cor === 'violet' ? 'text-violet-500' :
                                                                    'text-neutral-500'
                                                                }`} />
                                                                <span className="text-neutral-300">{recurso}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {isSelected && (
                                                        <div className="absolute top-4 right-4">
                                                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                                <Check className="w-4 h-4 text-black" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Card>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-8 text-center">
                                        <p className="text-neutral-500 text-sm flex items-center justify-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            7 dias grátis para testar. Sem compromisso. Cancele quando quiser.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Dados da Empresa */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-10">
                                        <h1 className="text-4xl font-bold mb-4">Dados da Empresa</h1>
                                        <p className="text-neutral-400">
                                            Informações para emissão de nota fiscal
                                        </p>
                                    </div>

                                    <Card className="p-8 bg-neutral-900/50 border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <Label htmlFor="nomeFantasia" className="text-neutral-300">Nome Fantasia *</Label>
                                                <Input
                                                    id="nomeFantasia"
                                                    name="nomeFantasia"
                                                    value={formData.nomeFantasia}
                                                    onChange={handleChange}
                                                    placeholder="Ex: Espaço Revelle"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                                {formData.nomeFantasia && (
                                                    <p className="text-sm text-neutral-500 mt-2">
                                                        Sua URL: <span className="text-amber-400">https://{slugEscola}.grandsalto.ia</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor="razaoSocial" className="text-neutral-300">Razão Social *</Label>
                                                <Input
                                                    id="razaoSocial"
                                                    name="razaoSocial"
                                                    value={formData.razaoSocial}
                                                    onChange={handleChange}
                                                    placeholder="Nome completo da empresa"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="cnpj" className="text-neutral-300">CNPJ *</Label>
                                                <Input
                                                    id="cnpj"
                                                    name="cnpj"
                                                    value={formData.cnpj}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
                                                    placeholder="00.000.000/0001-00"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="inscricaoEstadual" className="text-neutral-300">Inscrição Estadual</Label>
                                                <Input
                                                    id="inscricaoEstadual"
                                                    name="inscricaoEstadual"
                                                    value={formData.inscricaoEstadual}
                                                    onChange={handleChange}
                                                    placeholder="Opcional"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="inscricaoMunicipal" className="text-neutral-300">Inscrição Municipal</Label>
                                                <Input
                                                    id="inscricaoMunicipal"
                                                    name="inscricaoMunicipal"
                                                    value={formData.inscricaoMunicipal}
                                                    onChange={handleChange}
                                                    placeholder="Opcional"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="emailEscola" className="text-neutral-300">Email da Escola</Label>
                                                <Input
                                                    id="emailEscola"
                                                    name="emailEscola"
                                                    type="email"
                                                    value={formData.emailEscola}
                                                    onChange={handleChange}
                                                    placeholder="contato@suaescola.com.br"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="telefone" className="text-neutral-300">Telefone</Label>
                                                <Input
                                                    id="telefone"
                                                    name="telefone"
                                                    value={formData.telefone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: formatPhone(e.target.value) }))}
                                                    placeholder="(00) 00000-0000"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="whatsapp" className="text-neutral-300">WhatsApp</Label>
                                                <Input
                                                    id="whatsapp"
                                                    name="whatsapp"
                                                    value={formData.whatsapp}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: formatPhone(e.target.value) }))}
                                                    placeholder="(00) 00000-0000"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="website" className="text-neutral-300">Website Atual</Label>
                                                <Input
                                                    id="website"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    placeholder="https://seusite.com.br (opcional)"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 3: Endereço */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-10">
                                        <h1 className="text-4xl font-bold mb-4">Endereço da Escola</h1>
                                        <p className="text-neutral-400">
                                            Localização para nota fiscal e contato
                                        </p>
                                    </div>

                                    <Card className="p-8 bg-neutral-900/50 border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <Label htmlFor="cep" className="text-neutral-300">CEP *</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="cep"
                                                        name="cep"
                                                        value={formData.cep}
                                                        onChange={(e) => {
                                                            const formatted = formatCEP(e.target.value)
                                                            setFormData(prev => ({ ...prev, cep: formatted }))
                                                            if (formatted.replace(/\D/g, '').length === 8) {
                                                                buscarCEP(formatted)
                                                            }
                                                        }}
                                                        placeholder="00000-000"
                                                        className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                    />
                                                    {buscandoCep && (
                                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 w-4 h-4 animate-spin text-amber-500" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor="logradouro" className="text-neutral-300">Logradouro *</Label>
                                                <Input
                                                    id="logradouro"
                                                    name="logradouro"
                                                    value={formData.logradouro}
                                                    onChange={handleChange}
                                                    placeholder="Rua, Avenida, etc."
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="numero" className="text-neutral-300">Número *</Label>
                                                <Input
                                                    id="numero"
                                                    name="numero"
                                                    value={formData.numero}
                                                    onChange={handleChange}
                                                    placeholder="123"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor="complemento" className="text-neutral-300">Complemento</Label>
                                                <Input
                                                    id="complemento"
                                                    name="complemento"
                                                    value={formData.complemento}
                                                    onChange={handleChange}
                                                    placeholder="Sala, Andar, Bloco (opcional)"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="bairro" className="text-neutral-300">Bairro *</Label>
                                                <Input
                                                    id="bairro"
                                                    name="bairro"
                                                    value={formData.bairro}
                                                    onChange={handleChange}
                                                    placeholder="Bairro"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="cidade" className="text-neutral-300">Cidade *</Label>
                                                <Input
                                                    id="cidade"
                                                    name="cidade"
                                                    value={formData.cidade}
                                                    onChange={handleChange}
                                                    placeholder="Cidade"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="estado" className="text-neutral-300">Estado *</Label>
                                                <select
                                                    id="estado"
                                                    name="estado"
                                                    value={formData.estado}
                                                    onChange={handleChange}
                                                    className="mt-2 w-full h-10 px-3 rounded-md bg-neutral-800 border border-neutral-700 focus:border-amber-500 text-white"
                                                >
                                                    <option value="">Selecione</option>
                                                    {estadosBrasil.map(uf => (
                                                        <option key={uf} value={uf}>{uf}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 4: Responsável */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-10">
                                        <h1 className="text-4xl font-bold mb-4">Responsável Legal</h1>
                                        <p className="text-neutral-400">
                                            Dados do administrador principal da conta
                                        </p>
                                    </div>

                                    <Card className="p-8 bg-neutral-900/50 border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <Label htmlFor="nomeResponsavel" className="text-neutral-300">Nome Completo *</Label>
                                                <Input
                                                    id="nomeResponsavel"
                                                    name="nomeResponsavel"
                                                    value={formData.nomeResponsavel}
                                                    onChange={handleChange}
                                                    placeholder="Nome completo do responsável"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="cpfResponsavel" className="text-neutral-300">CPF *</Label>
                                                <Input
                                                    id="cpfResponsavel"
                                                    name="cpfResponsavel"
                                                    value={formData.cpfResponsavel}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, cpfResponsavel: formatCPF(e.target.value) }))}
                                                    placeholder="000.000.000-00"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="emailResponsavel" className="text-neutral-300">Email *</Label>
                                                <Input
                                                    id="emailResponsavel"
                                                    name="emailResponsavel"
                                                    type="email"
                                                    value={formData.emailResponsavel}
                                                    onChange={handleChange}
                                                    placeholder="seu@email.com"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    Este será seu email de login
                                                </p>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor="telefoneResponsavel" className="text-neutral-300">Telefone/WhatsApp *</Label>
                                                <Input
                                                    id="telefoneResponsavel"
                                                    name="telefoneResponsavel"
                                                    value={formData.telefoneResponsavel}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, telefoneResponsavel: formatPhone(e.target.value) }))}
                                                    placeholder="(00) 00000-0000"
                                                    className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 5: Acesso */}
                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-10">
                                        <h1 className="text-4xl font-bold mb-4">Crie sua Senha</h1>
                                        <p className="text-neutral-400">
                                            Últimos passos para começar sua jornada
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Card className="p-8 bg-neutral-900/50 border-white/5">
                                            <h3 className="font-bold text-lg mb-6">Defina sua senha de acesso</h3>

                                            <div className="space-y-6">
                                                <div>
                                                    <Label htmlFor="senha" className="text-neutral-300">Senha *</Label>
                                                    <Input
                                                        id="senha"
                                                        name="senha"
                                                        type="password"
                                                        value={formData.senha}
                                                        onChange={handleChange}
                                                        placeholder="Mínimo 8 caracteres"
                                                        className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="confirmarSenha" className="text-neutral-300">Confirmar Senha *</Label>
                                                    <Input
                                                        id="confirmarSenha"
                                                        name="confirmarSenha"
                                                        type="password"
                                                        value={formData.confirmarSenha}
                                                        onChange={handleChange}
                                                        placeholder="Digite novamente"
                                                        className="mt-2 bg-neutral-800 border-neutral-700 focus:border-amber-500"
                                                    />
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-8 bg-amber-500/5 border-amber-500/20">
                                            <h3 className="font-bold text-lg mb-6 text-amber-400">Resumo do Cadastro</h3>

                                            <div className="space-y-4 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Escola:</span>
                                                    <span className="font-medium">{formData.nomeFantasia || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">CNPJ:</span>
                                                    <span className="font-medium">{formData.cnpj || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Responsável:</span>
                                                    <span className="font-medium">{formData.nomeResponsavel || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-400">Email:</span>
                                                    <span className="font-medium">{formData.emailResponsavel || '-'}</span>
                                                </div>

                                                <div className="border-t border-white/10 pt-4 mt-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-neutral-400">Plano:</span>
                                                        <span className="font-bold text-amber-400">{planoSelecionado?.nome}</span>
                                                    </div>
                                                    <div className="flex justify-between mt-2">
                                                        <span className="text-neutral-400">Período:</span>
                                                        <span className="font-medium capitalize">{formData.periodoCobranca}</span>
                                                    </div>
                                                    <div className="flex justify-between mt-2">
                                                        <span className="text-neutral-400">Valor:</span>
                                                        <span className="font-bold text-white">
                                                            R$ {formData.periodoCobranca === 'anual'
                                                                ? Math.round((planoSelecionado?.precoAnual || 0) / 12)
                                                                : planoSelecionado?.preco}/mês
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="bg-green-500/10 text-green-400 p-4 rounded-lg mt-4">
                                                    <p className="font-bold flex items-center gap-2">
                                                        <Star className="w-4 h-4" />
                                                        7 dias grátis inclusos!
                                                    </p>
                                                    <p className="text-xs mt-1 text-green-300/80">
                                                        Você só será cobrado após o período de teste
                                                    </p>
                                                </div>

                                                <div className="bg-white/5 p-4 rounded-lg">
                                                    <p className="text-neutral-400 text-xs">Sua URL de acesso:</p>
                                                    <p className="text-amber-400 font-mono text-sm mt-1">
                                                        https://{slugEscola || 'sua-escola'}.grandsalto.ia
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-10">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="border-white/10 hover:bg-white/5"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>

                            {step < totalSteps ? (
                                <Button
                                    onClick={nextStep}
                                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8"
                                >
                                    Continuar
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Criando conta...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Criar Conta Grátis
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CadastroEscolaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
            </div>
        }>
            <CadastroContent />
        </Suspense>
    )
}
