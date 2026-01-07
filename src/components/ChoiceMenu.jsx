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
        <div className={`w-full max-w-2xl mx-auto mt-8 ${disabled ? 'opacity-50' : ''}`}>
            {title && <h2 className="mb-4 text-xl">{title}</h2>}
            <div className="flex-col gap-2 space-y-3">
                {options.map((option, index) => (
                    <div
                        key={option.id}
                        className={`p-4 border-2 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${index === selectedIndex
                            ? 'border-[var(--color-phosphor)] bg-[rgba(51,255,51,0.1)]'
                            : 'border-transparent hover:border-[var(--color-phosphor-dim)]'
                            }`}
                        onClick={() => !disabled && onSelect(option.id)}
                        onMouseEnter={() => !disabled && setSelectedIndex(index)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xl">
                                {index + 1}. {option.name || option.label}
                            </span>
                            {index === selectedIndex && <span className="animate-pulse">&lt;&lt;</span>}
                        </div>
                        {(option.description || option.details) && (
                            <p className="mt-2 text-sm opacity-80 pl-6">
                                {option.description || option.details}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center text-sm opacity-50">
                [USE ARROW KEYS OR NUMBERS TO SELECT]
            </div>
        </div>
    );
};

export default ChoiceMenu;
