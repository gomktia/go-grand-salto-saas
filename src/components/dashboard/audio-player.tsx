'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'
import { updateProgressoRecurso, incrementarVisualizacoes } from '@/app/actions/admin'

type AudioPlayerProps = {
    recursoId: string
    titulo: string
    url: string
    progressoInicial?: number
}

export function AudioPlayer({
    recursoId,
    titulo,
    url,
    progressoInicial = 0
}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(progressoInicial)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)

    // Incrementar visualizações ao montar
    useEffect(() => {
        incrementarVisualizacoes(recursoId)
    }, [recursoId])

    // Salvar progresso a cada 5 segundos
    useEffect(() => {
        if (!audioRef.current) return

        const interval = setInterval(() => {
            if (audioRef.current && !audioRef.current.paused) {
                const progresso = Math.floor(audioRef.current.currentTime)
                const completo = progresso >= (audioRef.current.duration - 5)

                updateProgressoRecurso({
                    recurso_id: recursoId,
                    progresso_segundos: progresso,
                    completado: completo
                }).catch(console.error)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [recursoId])

    const handlePlayPause = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleMute = () => {
        if (!audioRef.current) return
        audioRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleSkipBackward = () => {
        if (!audioRef.current) return
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }

    const handleSkipForward = () => {
        if (!audioRef.current) return
        audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
    }

    const handleTimeUpdate = () => {
        if (!audioRef.current) return
        setCurrentTime(audioRef.current.currentTime)
    }

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return
        setDuration(audioRef.current.duration)

        // Restaurar progresso inicial
        if (progressoInicial > 0) {
            audioRef.current.currentTime = progressoInicial
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return
        const time = parseFloat(e.target.value)
        audioRef.current.currentTime = time
        setCurrentTime(time)
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return
        const vol = parseFloat(e.target.value)
        audioRef.current.volume = vol
        setVolume(vol)
        setIsMuted(vol === 0)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <Card className="overflow-hidden bg-card border-border">
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={url}
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

            {/* Visual Player */}
            <div className="p-6">
                {/* Album Art / Icon */}
                <div className="flex items-center justify-center w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl mb-6">
                    <Music className="w-24 h-24 text-primary/40" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-foreground text-lg mb-2 text-center">{titulo}</h3>
                <p className="text-xs text-muted-foreground text-center mb-6">
                    {duration > 0 && `Duração: ${formatTime(duration)}`}
                </p>

                {/* Progress Bar */}
                <div className="mb-6">
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                        style={{
                            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercent}%, hsl(var(--muted)) ${progressPercent}%, hsl(var(--muted)) 100%)`
                        }}
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-muted-foreground font-mono">{formatTime(currentTime)}</span>
                        <span className="text-xs text-muted-foreground font-mono">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleSkipBackward}
                        className="border-border"
                    >
                        <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button
                        size="lg"
                        onClick={handlePlayPause}
                        className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </Button>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleSkipForward}
                        className="border-border"
                    >
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 justify-center">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleMute}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-32 h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />

                    <span className="text-xs text-muted-foreground font-mono w-10">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>
        </Card>
    )
}
