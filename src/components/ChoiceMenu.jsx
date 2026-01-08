import { useEffect, useState } from 'react';
import { playSound } from '../utils/SoundManager';

const ChoiceMenu = ({ options, onSelect, title, disabled = false }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (disabled) return; // Prevent input when disabled

            if (e.key === 'ArrowUp') {
                setSelectedIndex((prev) => {
                    playSound('select');
                    return prev > 0 ? prev - 1 : options.length - 1;
                });
            } else if (e.key === 'ArrowDown') {
                setSelectedIndex((prev) => {
                    playSound('select');
                    return prev < options.length - 1 ? prev + 1 : 0;
                });
            } else if (e.key === 'Enter') {
                playSound('type');
                onSelect(options[selectedIndex].id);
            } else {
                // Number keys 1-9
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= options.length) {
                    playSound('type');
                    onSelect(options[num - 1].id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [options, onSelect, disabled]);

    return (
        <div className={`w-full max-w-2xl mx-auto mt-6 ${disabled ? 'opacity-50' : ''}`}>
            {title && (
                <div className="mb-6 px-4">
                    <h2 className="text-xl leading-tight border-l-4 border-[var(--color-phosphor)] pl-4">
                        {title}
                    </h2>
                </div>
            )}
            <div className="flex-col space-y-4">
                {options.map((option, index) => (
                    <div
                        key={option.id}
                        className={`p-6 border-2 transition-all active:scale-[0.98] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${index === selectedIndex
                            ? 'border-[var(--color-phosphor)] bg-[rgba(51,255,51,0.15)] shadow-[0_0_15px_rgba(51,255,51,0.2)]'
                            : 'border-[rgba(51,255,51,0.2)] hover:border-[var(--color-phosphor-dim)]'
                            }`}
                        onClick={() => !disabled && onSelect(option.id)}
                        onMouseEnter={() => !disabled && setSelectedIndex(index)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold tracking-wide uppercase">
                                {option.name || option.label}
                            </span>
                            {index === selectedIndex && (
                                <span className="animate-pulse text-[var(--color-phosphor)]">▶</span>
                            )}
                        </div>
                        {(option.description || option.details) && (
                            <p className="mt-3 text-sm opacity-70 line-clamp-2">
                                {option.description || option.details}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center text-xs opacity-40 uppercase tracking-widest">
                [ Tap to Liberrate ]
            </div>
        </div>
    );
};

export default ChoiceMenu;
