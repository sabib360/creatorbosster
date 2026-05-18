import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolPage from '../ToolPage';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setOutput('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✅ Valid JSON!');
    } catch (err: any) {
      setError('❌ Invalid JSON: ' + (err.message || 'Unknown error'));
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
    element.setAttribute('download', 'formatted.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">JSON Formatter & Validator</h1>
          <p className="text-gray-400">Format, beautify, validate, and minify JSON instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">Input JSON</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">Output</label>
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
            onClick={formatJSON}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition"
          >
            📐 Format
          </button>
          <button
            onClick={minifyJSON}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            📦 Minify
          </button>
          <button
            onClick={validateJSON}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            ✓ Validate
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
                onClick={downloadJSON}
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
            <li>✓ Format and beautify JSON</li>
            <li>✓ Minify JSON for smaller file sizes</li>
            <li>✓ Validate JSON syntax</li>
            <li>✓ Copy to clipboard</li>
            <li>✓ Download as file</li>
            <li>✓ Support for all JSON data types</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">❓ FAQ</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-1">What is JSON?</h4>
              <p className="text-gray-400 text-sm">JSON (JavaScript Object Notation) is a lightweight data format for storing and exchanging data.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Why format JSON?</h4>
              <p className="text-gray-400 text-sm">Formatted JSON is easier to read and debug. Minified JSON takes less space.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Is my data safe?</h4>
              <p className="text-gray-400 text-sm">Yes! All processing happens in your browser. We never upload or store your data.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </ToolPage>
  );
}
