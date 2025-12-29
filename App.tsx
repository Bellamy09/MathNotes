
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, BookOpen, Trash2 } from 'lucide-react';
import { AppMode, Note } from './types';
import Toolbar from './components/Toolbar';
import MathPreview from './components/MathPreview';
import VoiceControl from './components/VoiceControl';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.EDIT);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: '1',
    title: 'New Lecture Notes',
    content: '# Introduction to Probabilities\n\nStart your lecture notes here. Use the microphone to convert your voice into LaTeX formulas!\n\nExample:\n$$ P(A|B) = \\frac{P(B|A)P(A)}{P(B)} $$',
    createdAt: Date.now()
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertText = (text: string, cursorOffset: number = 0) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentText = currentNote.content;
    const newText = currentText.substring(0, start) + text + currentText.substring(end);
    
    setCurrentNote(prev => ({ ...prev, content: newText }));
    
    // Set focus back and adjust cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + text.length + cursorOffset;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleVoiceResult = (latex: string) => {
    const formatted = `\n${latex}\n`;
    handleInsertText(formatted);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <input 
              type="text" 
              value={currentNote.title}
              onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
              className="font-bold text-gray-800 text-lg bg-transparent border-none focus:outline-none focus:ring-0 w-full md:w-64"
              placeholder="Lecture Title..."
            />
            <p className="text-xs text-gray-400">Created: {new Date(currentNote.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
          <button className="hidden sm:flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
            <Save size={18} />
            <span className="text-sm font-medium">Save</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-4 overflow-hidden h-[calc(100vh-140px)]">
        
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          
          <Toolbar mode={mode} setMode={setMode} onInsert={handleInsertText} />

          <div className="flex-1 flex overflow-hidden">
            {/* Editor Area */}
            {(mode === AppMode.EDIT || mode === AppMode.SPLIT) && (
              <div className={`flex-1 flex flex-col ${mode === AppMode.SPLIT ? 'md:border-r border-gray-100' : ''}`}>
                <textarea
                  ref={textareaRef}
                  value={currentNote.content}
                  onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
                  className="flex-1 w-full p-6 text-gray-700 resize-none focus:outline-none math-font text-base leading-relaxed overflow-y-auto"
                  placeholder="Start writing notes with Markdown and LaTeX..."
                />
              </div>
            )}

            {/* Preview Area */}
            {(mode === AppMode.PREVIEW || mode === AppMode.SPLIT) && (
              <div className={`flex-1 overflow-y-auto bg-gray-50/50 ${mode === AppMode.PREVIEW ? 'block' : 'hidden md:block'}`}>
                <MathPreview content={currentNote.content} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Voice Assistant */}
      <VoiceControl onResult={handleVoiceResult} />
      
      {/* Mobile-only action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-40">
        <button className="text-gray-400">
           <Plus size={24} />
        </button>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
          Save Note
        </button>
      </div>
    </div>
  );
};

export default App;
