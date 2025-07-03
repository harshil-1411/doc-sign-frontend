import { useState } from 'react';

const fonts = [
  { label: 'Cursive', value: 'cursive', style: { fontFamily: 'cursive' } },
  { label: 'Serif', value: 'serif', style: { fontFamily: 'serif' } },
  { label: 'Sans', value: 'sans-serif', style: { fontFamily: 'sans-serif' } },
  { label: 'Monospace', value: 'monospace', style: { fontFamily: 'monospace' } },
  { label: 'Fantasy', value: 'fantasy', style: { fontFamily: 'fantasy' } },
  { label: 'Script', value: 'Zapfino, cursive', style: { fontFamily: 'Zapfino, cursive' } },
];

export default function SignatureCreator({ onSignatureChange }) {
  const [text, setText] = useState('');
  const [font, setFont] = useState(fonts[0].value);

  const handleTextChange = (e) => {
    setText(e.target.value);
    onSignatureChange && onSignatureChange(e.target.value, font);
  };

  const handleFontChange = (e) => {
    setFont(e.target.value);
    onSignatureChange && onSignatureChange(text, e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <label className="block font-semibold mb-2">Create Your Signature</label>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Type your name"
        className="border rounded px-3 py-2 w-full mb-2"
      />
      <div className="flex gap-2 mb-2">
        {fonts.map((f) => (
          <label key={f.value} className="flex items-center gap-1">
            <input
              type="radio"
              name="font"
              value={f.value}
              checked={font === f.value}
              onChange={handleFontChange}
            />
            <span style={f.style}>{f.label}</span>
          </label>
        ))}
      </div>
      <div className="mt-2">
        <span className="text-gray-500">Preview:</span>
        <div className="mt-1 p-2 border rounded text-2xl" style={{ fontFamily: fonts.find(f => f.value === font)?.style.fontFamily }}>
          {text || 'Your Signature Here'}
        </div>
      </div>
    </div>
  );
} 