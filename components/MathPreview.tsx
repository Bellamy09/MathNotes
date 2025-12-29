
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathPreviewProps {
  content: string;
}

const MathPreview: React.FC<MathPreviewProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 text-gray-800" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3 text-gray-800" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
          code: ({ node, ...props }) => <code className="bg-gray-100 px-1 rounded text-pink-600" {...props} />,
        }}
      >
        {content || "*No content yet. Start typing or use the voice assistant to add math!*"}
      </ReactMarkdown>
    </div>
  );
};

export default MathPreview;
