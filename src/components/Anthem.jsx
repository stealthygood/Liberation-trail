import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

// Crude 8-bit "anthem" using Web Audio API
const Anthem = () => {
    const { state } = useGame();
    const audioContextRef = useRef(null);
    const isPlayingRef = useRef(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const playNote = (freq, time, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.05, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(time);
            osc.stop(time + duration);
        };

        const playAnthem = () => {
            if (!isPlayingRef.current) return;
            const now = ctx.currentTime;
            const beat = 0.4;

            // "The Star-Spangled Banner" opening (very simplified)
            [
                392.00, 329.63, 261.63, 329.63, 392.00, 523.25, // Oh say can you see...
                659.25, 587.33, 523.25, 329.63, 349.23, 392.00, // By the dawn's early light...
            ].forEach((note, i) => {
                playNote(note, now + i * beat, beat * 0.8);
            });

            // Loop
            timeoutRef.current = setTimeout(playAnthem, 12 * beat * 1000 + 2000);
        };

        const start = () => {
            // Basic interaction check usually needed, but for simplicity:
            isPlayingRef.current = true;
            playAnthem();
        };

        // Auto-start on click anywhere if blocked
        const handleInteraction = () => {
            if (ctx.state === 'suspended') ctx.resume();
            if (!isPlayingRef.current) start();
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            isPlayingRef.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (ctx) ctx.close();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    // Effectively manage mute/unmute
    useEffect(() => {
        if (!audioContextRef.current) return;

        if (state.soundEnabled) {
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        } else {
            if (audioContextRef.current.state === 'running') {
                audioContextRef.current.suspend();
            }
        }
    }, [state.soundEnabled]);

    return null; // Invisible component
};

export default Anthem;
