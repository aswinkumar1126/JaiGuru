import React, { useRef, useState } from 'react';
import './video.css';
import Button from '../../components/button/Button';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import Error from '../../components/error/Error';

function Video({ videoUrl, loading, error, onRetry }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true); // Changed to true for autoplay
    const [isMuted, setIsMuted] = useState(true); // Muted by default for autoplay compatibility
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    if (loading) return <SkeletonLoader loading={loading} />;
    if (error) return <Error onRetry={onRetry || (() => window.location.reload())} />;

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <section className="video-showcase">
            <header className="video-header">
                <h2 className="video-title">Jewellery Video Showcase</h2>
                <p className="video-subtitle">Discover Our Elegant Collection</p>
            </header>

            <div className="video-content">
                <div className="video-player-container">
                    <div className="video-wrapper">
                        <video
                            ref={videoRef}
                            controls={false}
                            className="responsive-video"
                            poster="/video-poster.jpg"
                            preload="metadata"
                            loop
                            muted={isMuted}
                            autoPlay // Added for autoplay
                            onClick={togglePlay}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support HTML5 video.
                        </video>

                        <div className="video-controls">
                            <Button
                                className="control-button"
                                onClick={togglePlay}
                                variant="secondary"
                                size="small"
                                icon={
                                    isPlaying ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )
                                }
                            />

                            <Button
                                className="control-button"
                                onClick={toggleMute}
                                variant="secondary"
                                size="small"
                                icon={
                                    isMuted ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                        </svg>
                                    )
                                }
                            />

                            <div className="video-time">
                                <span className="current-time">{formatTime(currentTime)}</span>
                                <span className="time-separator">/</span>
                                <span className="duration">{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Video;