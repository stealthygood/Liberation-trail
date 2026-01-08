import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import Typewriter from '../Typewriter';
import CelebrationOverlay from '../CelebrationOverlay';
import MiniGameIntro from '../MiniGameIntro';
import ScreenLayout from '../ScreenLayout';
import { useMiniGame } from '../../hooks/useMiniGame';

const QUESTIONS = [
    {
        id: 1,
        question: "Reporter: 'What do you call the 47 dead civilians?'",
        options: [
            { text: "Collateral damage", effects: { approval: 2, warCrimes: 1 } },
            { text: "Enemy combatants", effects: { approval: 5, warCrimes: 2 } },
            { text: "Crisis actors", effects: { approval: -10 } }, // 50/50 chance for +20 later? Let's keep it simple
            { text: "Tell the truth", effects: { choleraRisk: 25 }, isEthical: true }
        ]
    },
    {
        id: 2,
        question: "Reporter: 'Why did we secure the oil fields before the hospitals?'",
        options: [
            { text: "Energy security is national security", effects: { approval: 5, oil: 5 } },
            { text: "Logistical challenges", effects: { approval: 0 } },
            { text: "The hospitals were empty", effects: { approval: 3, warCrimes: 1 } },
            { text: "Hospitals don't power tanks", effects: { choleraRisk: 30 }, isEthical: true }
        ]
    },
    {
        id: 3,
        question: "Reporter: 'Is it true we're using chemical weapons?'",
        options: [
            { text: "That is enemy propaganda", effects: { approval: 10, warCrimes: 1 } },
            { text: "It was a pest control operation", effects: { approval: 5, warCrimes: 1 } },
            { text: "We call it 'Freedom Mist'", effects: { approval: 15, warCrimes: 2 } },
            { text: "Yes, and they work great", effects: { choleraRisk: 40 }, isEthical: true }
        ]
    }
];

const PressBriefingGame = () => {
    const { dispatch } = useGame();
    const [qIndex, setQIndex] = useState(0);
    const [timer, setTimer] = useState(5); // 5 seconds to answer
    const [gameOver, setGameOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        showIntro,
        setShowIntro,
        statsGained,
        completeMiniGame,
        handleCelebrationComplete
    } = useMiniGame();

    const currentQ = QUESTIONS[qIndex];

    const handleSelect = useCallback((option) => {
        if (isProcessing || gameOver) return;
        setIsProcessing(true);
        playSound('type');

        // Apply effects
        dispatch({ type: 'MODIFY_STATS', payload: option.effects });

        // Check for cholera death from truth-telling
        if (option.isEthical && Math.random() < 0.5) {
            setGameOver(true);
            playSound('error');
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            }, 1000);
            return;
        }

        // Move to next question or end
        setTimeout(() => {
            if (qIndex < QUESTIONS.length - 1) {
                setQIndex(qIndex + 1);
                setTimer(5);
                setIsProcessing(false);
            } else {
                setGameOver(true);
                playSound('success');
                const effects = { approval: 10, warCrimes: 0 };
                completeMiniGame(effects);
            }
        }, 800);
    }, [qIndex, isProcessing, gameOver, dispatch, completeMiniGame]);

    // Timer logic and auto-selection
    useEffect(() => {
        if (gameOver || isProcessing) return;

        if (timer <= 0) {
            const timeout = setTimeout(() => {
                handleSelect({ text: "PANIC", effects: { approval: -10, choleraRisk: 5 } });
            }, 0);
            return () => clearTimeout(timeout);
        }

        const interval = setInterval(() => {
            setTimer(t => Math.max(0, t - 0.1));
        }, 100);

        return () => clearInterval(interval);
    }, [timer, gameOver, isProcessing, handleSelect]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver || isProcessing) return;
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= currentQ.options.length) {
                handleSelect(currentQ.options[num - 1]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, isProcessing, currentQ.options, handleSelect]);

    return (
        <ScreenLayout center>
            <div className="w-full max-w-lg border-2 border-[var(--color-phosphor)] p-4 bg-black/80 relative">
                <div className="text-xs font-bold uppercase tracking-widest text-center mb-4">
                    *** PRESS BRIEFING ***
                </div>

                <div className="mb-6 mt-2 text-center">
                    <div className="text-lg md:text-xl min-h-[50px] italic">
                        <Typewriter text={currentQ.question} speed={20} />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4 text-[10px] font-mono opacity-70">
                    <span>CHOOSE SPIN:</span>
                    <span className={timer < 2 ? 'text-red-500 animate-pulse' : ''}>
                        {timer.toFixed(1)}s
                    </span>
                </div>

                <div className="flex-col space-y-3">
                    {currentQ.options.map((option, i) => (
                        <button
                            key={i}
                            disabled={isProcessing}
                            onClick={() => handleSelect(option)}
                            className="text-left border-2 border-[var(--color-phosphor-dim)] p-4 hover:border-[var(--color-phosphor)] bg-transparent active:bg-[rgba(51,255,51,0.1)] transition-all font-bold uppercase text-sm"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>

            <pre className="mt-8 text-[0.6rem] leading-none opacity-30 select-none pointer-events-none">
                {`       .-------.
      /   _   \\
     |  ( )  |
      \\  ^  /
       '---'
    /\\     /\\
   /  \\   /  \\
  /    \\ /    \\
 /      ^      \\
/_______________\\`}
            </pre>
            {showIntro && (
                <MiniGameIntro
                    title="THE SPIN DOCTOR'S HOUR"
                    description="The press is hungry for 'facts'. Give them the alternative variety. Every successful redirection is a victory for national stability and your career."
                    instruction="CHOOSE THE MOST PATRIOTIC ANSWERS. AVOID THE TRUTH AT ALL COSTS."
                    onComplete={() => setShowIntro(false)}
                />
            )}

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => handleCelebrationComplete(SCREENS.EVENT)}
                />
            )}
        </ScreenLayout>
    );
};

export default PressBriefingGame;
