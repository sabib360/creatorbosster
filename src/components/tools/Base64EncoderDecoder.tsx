import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolPage from '../ToolPage';

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setError('');
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (err: any) {
      setError('Error encoding: ' + err.message);
      setOutput('');
    }
  };

  const decode = () => {
    try {
      setError('');
      const decoded = atob(input);
      setOutput(decoded);
    } catch (err: any) {
      setError('Invalid Base64 string');
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      encode();
    } else {
      decode();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const extension = mode === 'encode' ? '.txt' : '.txt';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
    element.setAttribute('download', `base64${extension}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Base64 Encoder & Decoder</h1>
          <p className="text-gray-400">Encode text to Base64 or decode Base64 strings instantly</p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setMode('encode');
              setInput('');
              setOutput('');
              setError('');
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'encode'
                ? 'bg-primary text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white border border-slate-700'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => {
              setMode('decode');
              setInput('');
              setOutput('');
              setError('');
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'decode'
                ? 'bg-primary text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white border border-slate-700'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">
              {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">{error}</div>}

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleProcess}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition"
          >
            {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
          </button>
          {output && (
            <>
              <button
                onClick={copyToClipboard}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadFile}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </>
          )}
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">✨ Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Encode text to Base64</li>
            <li>✓ Decode Base64 strings</li>
            <li>✓ Support for Unicode</li>
            <li>✓ Copy to clipboard</li>
            <li>✓ Download results</li>
            <li>✓ Real-time processing</li>
          </ul>
        </div>

        {/* Info */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 space-y-2">
          <h3 className="font-semibold text-blue-200">What is Base64?</h3>
          <p className="text-blue-100 text-sm">
            Base64 is a text encoding scheme that represents binary data using 64 printable ASCII characters. It's commonly used for
            encoding emails, images, and other binary data for transmission over text-based protocols.
          </p>
        </div>
      </motion.div>
    </ToolPage>
  );
}
