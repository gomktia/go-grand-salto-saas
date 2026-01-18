'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Maximize, Minimize, Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { updateProgressoRecurso, incrementarVisualizacoes } from '@/app/actions/admin'

type VideoPlayerProps = {
    recursoId: string
    titulo: string
    url?: string
    urlExterna?: string
    tipo: 'video' | 'link'
    progressoInicial?: number
}

export function VideoPlayer({
    recursoId,
    titulo,
    url,
    urlExterna,
    tipo,
    progressoInicial = 0
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [currentTime, setCurrentTime] = useState(progressoInicial)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)

    // Detectar tipo de vídeo externo
    const isYoutube = urlExterna?.includes('youtube.com') || urlExterna?.includes('youtu.be')
    const isVimeo = urlExterna?.includes('vimeo.com')

    // Converter URL do YouTube para embed
    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.includes('youtu.be')
            ? url.split('youtu.be/')[1]?.split('?')[0]
            : url.split('v=')[1]?.split('&')[0]
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
    }

    // Converter URL do Vimeo para embed
    const getVimeoEmbedUrl = (url: string) => {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
    }

    // Incrementar visualizações ao montar
    useEffect(() => {
        incrementarVisualizacoes(recursoId)
    }, [recursoId])

    // Salvar progresso a cada 5 segundos
    useEffect(() => {
        if (!videoRef.current || tipo === 'link') return

        const interval = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
                const progresso = Math.floor(videoRef.current.currentTime)
                const completo = progresso >= (videoRef.current.duration - 5)

                updateProgressoRecurso({
                    recurso_id: recursoId,
                    progresso_segundos: progresso,
                    completado: completo
                }).catch(console.error)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [recursoId, tipo])

    // Event handlers para vídeo HTML5
    const handlePlayPause = () => {
        if (!videoRef.current) return

        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleMute = () => {
        if (!videoRef.current) return
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleFullscreen = () => {
        if (!containerRef.current) return

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
        setIsFullscreen(!isFullscreen)
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        setCurrentTime(videoRef.current.currentTime)
    }

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return
        setDuration(videoRef.current.duration)

        // Restaurar progresso inicial
        if (progressoInicial > 0) {
            videoRef.current.currentTime = progressoInicial
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return
        const time = parseFloat(e.target.value)
        videoRef.current.currentTime = time
        setCurrentTime(time)
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return
        const vol = parseFloat(e.target.value)
        videoRef.current.volume = vol
        setVolume(vol)
        setIsMuted(vol === 0)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Render YouTube/Vimeo embed
    if (tipo === 'link' && urlExterna) {
        let embedUrl = urlExterna

        if (isYoutube) {
            embedUrl = getYoutubeEmbedUrl(urlExterna)
        } else if (isVimeo) {
            embedUrl = getVimeoEmbedUrl(urlExterna)
        }

        return (
            <Card className="overflow-hidden bg-card border-border">
                <div className="aspect-video bg-black">
                    <iframe
                        src={embedUrl}
                        title={titulo}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className="p-4 border-t border-border">
                    <h3 className="font-bold text-foreground">{titulo}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isYoutube && '📺 YouTube'}
                        {isVimeo && '🎬 Vimeo'}
                        {!isYoutube && !isVimeo && '🔗 Link Externo'}
                    </p>
                </div>
            </Card>
        )
    }

    // Render HTML5 video player
    return (
        <Card className="overflow-hidden bg-card border-border">
            <div ref={containerRef} className="relative group">
                {/* Video Element */}
                <video
                    ref={videoRef}
                    src={url}
                    className="w-full aspect-video bg-black"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                        setIsPlaying(false)
                        updateProgressoRecurso({
                            recurso_id: recursoId,
                            progresso_segundos: Math.floor(duration),
                            completado: true
                        })
                    }}
                />

                {/* Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 mb-3 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handlePlayPause}
                                className="text-white hover:bg-white/20"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleMute}
                                className="text-white hover:bg-white/20"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </Button>

                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />

                            <span className="text-white text-sm font-mono">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleFullscreen}
                            className="text-white hover:bg-white/20"
                        >
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 border-t border-border">
                <h3 className="font-bold text-foreground">{titulo}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {duration > 0 && `Duração: ${formatTime(duration)}`}
                </p>
            </div>
        </Card>
    )
}
