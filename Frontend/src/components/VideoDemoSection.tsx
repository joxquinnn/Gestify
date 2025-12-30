import React, { useState, useRef } from 'react';
import './VideoDemoSection.styles.css';

interface VideoMarker {
    time: number;
    title: string;
    description: string;
    position: { top: string; left: string };
}

const VideoDemoSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedDemo, setSelectedDemo] = useState<'video' | 'youtube'>('video');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Puntos interactivos en el video (ajusta según tu demo)
    const markers: VideoMarker[] = [
        {
            time: 5,
            title: "Dashboard Principal",
            description: "Vista general de métricas y estadísticas",
            position: { top: '20%', left: '30%' }
        },
        {
            time: 15,
            title: "Gestión de Tareas",
            description: "Administra y organiza tus proyectos",
            position: { top: '50%', left: '60%' }
        },
        {
            time: 25,
            title: "Reportes en Tiempo Real",
            description: "Análisis detallado de tu operación",
            position: { top: '70%', left: '40%' }
        }
    ];

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const jumpToTime = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const getVisibleMarkers = () => {
        return markers.filter(marker =>
            Math.abs(marker.time - currentTime) < 3
        );
    };

    return (
        <section className="video-demo-section">
            <div className="video-demo-container">
                <div className="demo-header">
                    <h2 className="demo-heading">
                        Ve <span className="accent-text">Gestify</span> en Acción
                    </h2>
                    <p className="demo-description">
                        Descubre cómo nuestra plataforma puede transformar la gestión de tu negocio
                    </p>
                </div>

                {/* Selector de tipo de demo */}
                <div className="demo-tabs">
                    <button
                        className={`demo-tab ${selectedDemo === 'video' ? 'active' : ''}`}
                        onClick={() => setSelectedDemo('video')}
                    >
                        📹 Video Demo
                    </button>
                    <button
                        className={`demo-tab ${selectedDemo === 'youtube' ? 'active' : ''}`}
                        onClick={() => setSelectedDemo('youtube')}
                    >
                        🎥 Video Completo
                    </button>
                </div>

                {/* Opción 1: Video desde tu servidor */}
                {selectedDemo === 'video' && (
                    <div className="video-wrapper">
                        <div className="video-container">
                            <video
                                ref={videoRef}
                                className="demo-video"
                                onTimeUpdate={handleTimeUpdate}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                poster="/images/video-thumbnail.jpg"
                            >
                                <source src="/videos/gestify-demo.mp4" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>

                            {/* Overlay con puntos interactivos */}
                            {showMarkers && !isPlaying && (
                                <div className="video-overlay">
                                    {markers.map((marker, index) => (
                                        <button
                                            key={index}
                                            className="video-marker"
                                            style={{
                                                top: marker.position.top,
                                                left: marker.position.left
                                            }}
                                            onClick={() => jumpToTime(marker.time)}
                                        >
                                            <div className="marker-pulse"></div>
                                            <div className="marker-tooltip">
                                                <strong>{marker.title}</strong>
                                                <p>{marker.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Controles personalizados */}
                            <div className="video-controls">
                                <button
                                    className="play-button"
                                    onClick={handlePlayPause}
                                >
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                <button
                                    className="markers-toggle"
                                    onClick={() => setShowMarkers(!showMarkers)}
                                >
                                    {showMarkers ? '🎯 Ocultar Puntos' : '🎯 Mostrar Puntos'}
                                </button>
                            </div>
                        </div>

                        {/* Timeline de secciones */}
                        <div className="video-timeline">
                            {markers.map((marker, index) => (
                                <button
                                    key={index}
                                    className="timeline-item"
                                    onClick={() => jumpToTime(marker.time)}
                                >
                                    <div className="timeline-icon">📍</div>
                                    <div className="timeline-content">
                                        <strong>{marker.title}</strong>
                                        <span>{marker.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selectedDemo === 'youtube' && (
                    <div className="video-wrapper">
                        <div className="video-container youtube-container">
                            <iframe
                                className="youtube-video"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1"
                                title="Gestify Demo Completo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="youtube-info">
                            <p className="info-text">
                                💡 <strong>Tip:</strong> Activa los subtítulos para seguir mejor la demostración
                            </p>
                        </div>
                    </div>
                )}

                {/* CTA después del video */}
                <div className="demo-cta">
                    <h3 className="cta-title">¿Listo para comenzar?</h3>
                    <p className="cta-description">
                        Solicita acceso y obtén una demostración personalizada para tu negocio
                    </p>
                    <button
                        className="cta-button"
                        onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Solicitar Demostración Personalizada
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VideoDemoSection;