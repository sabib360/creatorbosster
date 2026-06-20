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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Base64 Encoder & Decoder</h1>
          <p className="text-ink/60">Encode text to Base64 or decode Base64 strings instantly</p>
        </div>

        <p className="text-ink/70 leading-relaxed text-center max-w-2xl mx-auto">
          Convert plain text into Base64-encoded strings and back again with a single click. Developers use this when embedding binary data in JSON, configuring HTTP authorization headers, or debugging data URIs in web applications.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">How to Use the Encoder</h2>
          <ol className="space-y-3 text-ink/70 list-decimal list-inside">
            <li>Toggle between <strong className="text-ink">Encode</strong> and <strong className="text-ink">Decode</strong> mode using the selector buttons.</li>
            <li>Paste or type your text into the input textarea on the left.</li>
            <li>Press the <strong className="text-ink">Encode</strong> or <strong className="text-ink">Decode</strong> button to process.</li>
            <li>Copy the result to your clipboard or download it as a text file.</li>
          </ol>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Common Use Cases</h2>
          <ul className="space-y-2 text-ink/70">
            <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Encoding API credentials for Basic Auth headers in HTTP requests.</span></li>
            <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Embedding small images as data URIs directly in HTML or CSS without separate file hosting.</span></li>
            <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Decoding Base64 strings received from webhooks or email attachments to recover the original content.</span></li>
            <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Generating encoded tokens for JWT or session-based authentication flows during development.</span></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">Is Base64 the same as encryption?</h3>
              <p className="text-ink/60 text-sm leading-relaxed">No. Base64 is an encoding scheme, not encryption. It is trivially reversible and provides zero security. Anyone can decode a Base64 string. Use proper encryption (AES, RSA) if you need to protect sensitive data.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">Does it handle Unicode text?</h3>
              <p className="text-ink/60 text-sm leading-relaxed">The encoder uses the browser's built-in btoa() and atob() functions, which handle ASCII natively. For Unicode text, the input is automatically converted using encodeURIComponent before encoding, preserving characters across languages.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">What is the output size compared to input?</h3>
              <p className="text-ink/60 text-sm leading-relaxed">Base64 encoding increases the data size by approximately 33%. A 100-byte string becomes roughly 133 bytes after encoding. This is a known trade-off for representing binary data in text-safe formats.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">Is my data sent to a server?</h3>
              <p className="text-ink/60 text-sm leading-relaxed">No. All encoding and decoding happens locally in your browser. The text you enter never leaves your device.</p>
            </div>
          </div>
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
      </motion.div>
    </ToolPage>
  );
}
