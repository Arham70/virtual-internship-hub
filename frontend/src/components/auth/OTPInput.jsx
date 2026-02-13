import { useRef, useEffect } from 'react';

const LENGTH = 6;

/**
 * 6-digit OTP input. value/onChange are string (e.g. "123456").
 */
export function OTPInput({ value = '', onChange, disabled }) {
  const refs = useRef([]);

  useEffect(() => {
    if (refs.current[0]) refs.current[0].focus();
  }, []);

  const handleChange = (index, inputValue) => {
    const num = inputValue.replace(/[^0-9]/g, '');
    if (num.length > 1) {
      const pasted = num.slice(0, LENGTH);
      onChange(pasted);
      refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
      return;
    }
    const arr = value.split('');
    arr[index] = num;
    const next = arr.join('').slice(0, LENGTH);
    onChange(next);
    if (num && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'Backspace') {
      const arr = value.split('');
      arr[index] = '';
      onChange(arr.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    else if (e.key === 'ArrowRight' && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, LENGTH);
    onChange(pasted);
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:opacity-50"
        />
      ))}
    </div>
  );
}
