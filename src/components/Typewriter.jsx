import { useState, useEffect, useCallback } from 'react';

const Typewriter = ({ text, speed = 30, onComplete, className = '' }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // If text changes, we reset the internal state
    const [prevText, setPrevText] = useState(text);
    if (text !== prevText) {
        setPrevText(text);
        setDisplayedText('');
        setCurrentIndex(0);
        setIsFinished(false);
    }

    const finish = useCallback(() => {
        if (isFinished) return;
        setDisplayedText(text);
        setCurrentIndex(text.length);
        setIsFinished(true);
        if (onComplete) onComplete();
    }, [text, isFinished, onComplete]);

    useEffect(() => {
        if (currentIndex < text.length && !isFinished) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (!isFinished && currentIndex === text.length && text.length > 0) {
            // Move BOTH state updates to the next tick to avoid cascading renders warning
            const timeout = setTimeout(() => {
                setIsFinished(true);
                if (onComplete) onComplete();
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed, onComplete, isFinished]);

    // Handle skip on Space or Click
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                finish();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [finish]);

    return (
        <span
            className={`${className} cursor-pointer`}
            onClick={finish}
            title="Click or Space to skip"
        >
            {displayedText}
            {!isFinished && <span className="animate-pulse">█</span>}
        </span>
    );
};

export default Typewriter;
