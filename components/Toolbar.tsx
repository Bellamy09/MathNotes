
import React from 'react';
import { 
  Type, 
  Eye, 
  Split, 
  Sigma, 
  Infinity as InfinityIcon, 
  Pi, 
  FunctionSquare,
  Heading1,
  List,
  Braces,
  Parentheses,
  Divide,
  ChevronUp,
  Underline
} from 'lucide-react';
import { AppMode } from '../types';

interface ToolbarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onInsert: (text: string, cursorOffset?: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ mode, setMode, onInsert }) => {
  // Common symbols that are hard to reach on mobile
  const quickChars = [
    { label: '\\', value: '\\' },
    { label: '{ }', value: '{}', offset: -1 },
    { label: '[ ]', value: '[]', offset: -1 },
    { label: '_', value: '_{}', offset: -1 },
    { label: '^', value: '^{}', offset: -1 },
    { label: '$ $', value: '$$', offset: -1 },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '=', value: ' = ' },
  ];

  const mathSnippets = [
    { label: 'Sum', value: '$$\\sum_{n=1}^{\\infty} n$$', icon: <Sigma size={14} /> },
    { label: 'Integral', value: '$$\\int f(x) dx$$', icon: <FunctionSquare size={14} /> },
    { label: 'Fraction', value: '\\frac{}{}', icon: <Divide size={14} />, offset: -3 },
    { label: 'Sqrt', value: '\\sqrt{}', icon: <ChevronUp size={14} />, offset: -1 },
    { label: 'Pi', value: '\\pi', icon: <Pi size={14} /> },
    { label: 'Infinity', value: '\\infty', icon: <InfinityIcon size={14} /> },
    { label: 'Alpha', value: '\\alpha', icon: <span className="text-xs">α</span> },
    { label: 'Beta', value: '\\beta', icon: <span className="text-xs">β</span> },
    { label: 'Theta', value: '\\theta', icon: <span className="text-xs">θ</span> },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 flex flex-col shadow-sm">
      {/* Top Row: Mode Switching & Core Markdown */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMode(AppMode.EDIT)}
            className={`p-2 rounded-lg transition-colors ${mode === AppMode.EDIT ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Edit Mode"
          >
            <Type size={18} />
          </button>
          <button
            onClick={() => setMode(AppMode.PREVIEW)}
            className={`p-2 rounded-lg transition-colors ${mode === AppMode.PREVIEW ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Preview Mode"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => setMode(AppMode.SPLIT)}
            className={`hidden md:block p-2 rounded-lg transition-colors ${mode === AppMode.SPLIT ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Split View"
          >
            <Split size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button onClick={() => onInsert('# ')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Heading1 size={18} /></button>
          <button onClick={() => onInsert('- ')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><List size={18} /></button>
        </div>
      </div>

      {/* Bottom Row: Quick Symbols & Math (Scrollable) */}
      <div className="flex flex-col bg-gray-50/50">
        {/* Quick Chars Row */}
        <div className="flex items-center space-x-1 px-2 py-1 overflow-x-auto no-scrollbar border-b border-gray-100">
          {quickChars.map((char) => (
            <button
              key={char.label}
              onClick={() => onInsert(char.value, char.offset)}
              className="flex-shrink-0 min-w-[36px] h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md text-sm font-mono font-bold text-indigo-600 shadow-sm active:bg-indigo-50 active:scale-95 transition-all"
            >
              {char.label}
            </button>
          ))}
        </div>

        {/* Snippets Row */}
        <div className="flex items-center space-x-1 px-2 py-1.5 overflow-x-auto no-scrollbar">
          {mathSnippets.map((sym) => (
            <button
              key={sym.label}
              onClick={() => onInsert(sym.value, sym.offset)}
              className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-semibold text-gray-600 shadow-sm hover:border-indigo-300 active:scale-95 transition-all whitespace-nowrap"
            >
              <span className="text-indigo-500">{sym.icon}</span>
              <span>{sym.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
