import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button } from '../ui/Button';
import { FiMaximize2, FiMinimize2, FiSave, FiImage } from 'react-icons/fi';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string | number;
  maxHeight?: string | number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Escreva seu conteúdo em Markdown...',
  className = '',
  minHeight = '200px',
  maxHeight = '500px',
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que o componente está montado para evitar problemas de hidratação
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Função para inserir texto na posição atual do cursor
  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Focar e posicionar o cursor após a inserção
    setTimeout(() => {
      if (!textareaRef.current) return;
      const newCursorPos = start + text.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Função para adicionar formatação
  const addFormatting = (prefix: string, suffix: string = prefix, defaultText: string = 'texto') => {
    const selectedText = textareaRef.current?.value.substring(
      textareaRef.current.selectionStart,
      textareaRef.current.selectionEnd
    ) || defaultText;
    
    insertAtCursor(`${prefix}${selectedText}${suffix}`);
  };

  // Função para lidar com o upload de imagens
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aqui você implementaria o upload real da imagem
    // Por enquanto, vamos apenas simular um upload e retornar uma URL
    const imageUrl = URL.createObjectURL(file);
    
    // Insere a marcação da imagem no markdown
    insertAtCursor(`![${file.name}](${imageUrl})\n`);
    
    // Limpa o input para permitir o upload da mesma imagem novamente
    e.target.value = '';
  };

  // Estilo para o container baseado no estado de tela cheia
  const containerStyle = {
    minHeight: isFullscreen ? '90vh' : minHeight,
    maxHeight: isFullscreen ? 'none' : maxHeight,
  };

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden ${className}`}>
      {/* Barra de ferramentas */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('**', '**', 'texto em negrito')}
          title="Negrito (Ctrl+B)"
          className="font-bold"
        >
          B
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('*', '*', 'texto em itálico')}
          title="Itálico (Ctrl+I)"
          className="italic"
        >
          I
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('`', '`', 'código')}
          title="Código inline (Ctrl+`)"
          className="font-mono text-sm"
        >
          {`</>`}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('```\n', '\n```\n\n', 'código\n// seu código aqui')}
          title="Bloco de código"
          className="font-mono text-sm"
        >
          {`</>+`}
        </Button>
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('# ', '')}
          title="Título 1"
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('## ', '')}
          title="Título 2"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('### ', '')}
          title="Título 3"
        >
          H3
        </Button>
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('- ', '')}
          title="Lista não ordenada"
        >
          •
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addFormatting('1. ', '')}
          title="Lista ordenada"
        >
          1.
        </Button>
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        <label className="inline-flex items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            as="span"
            title="Inserir imagem"
          >
            <FiImage className="w-4 h-4" />
          </Button>
        </label>
        <div className="flex-1"></div>
        <Button
          type="button"
          variant={isPreview ? 'outline' : 'ghost'}
          size="sm"
          onClick={() => setIsPreview(false)}
          className={!isPreview ? 'bg-white shadow-sm' : ''}
        >
          Editar
        </Button>
        <Button
          type="button"
          variant={isPreview ? 'ghost' : 'outline'}
          size="sm"
          onClick={() => setIsPreview(true)}
          className={isPreview ? 'bg-white shadow-sm' : ''}
        >
          Visualizar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Área de edição/visualização */}
      <div className="relative" style={containerStyle}>
        {isPreview ? (
          <div className="p-4 overflow-auto" style={{ minHeight: 'inherit', maxHeight: 'inherit' }}>
            {isMounted && (
              <ReactMarkdown
                className="prose max-w-none"
                components={{
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !className?.includes('language-');
                    
                    return !isInline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      alt={props.alt || 'Imagem'}
                      className="max-w-full h-auto rounded border border-gray-200 my-2"
                    />
                  ),
                }}
              >
                {value || '*Nada para visualizar. Comece a digitar no modo de edição.*'}
              </ReactMarkdown>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 outline-none resize-none font-mono text-sm"
            style={{ minHeight: 'inherit', maxHeight: 'inherit' }}
            onKeyDown={(e) => {
              // Atalhos de teclado
              if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                  case 'b':
                    e.preventDefault();
                    addFormatting('**', '**', 'texto em negrito');
                    break;
                  case 'i':
                    e.preventDefault();
                    addFormatting('*', '*', 'texto em itálico');
                    break;
                  case '`':
                    e.preventDefault();
                    addFormatting('`', '`', 'código');
                    break;
                  case 's':
                  case 's':
                    e.preventDefault();
                    // Salvar rascunho (implementar lógica de salvamento)
                    break;
                }
              }
            }}
          />
        )}
      </div>

      {/* Contador de caracteres/palavras */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex justify-between">
        <div>
          {value ? value.split(/\s+/).filter(Boolean).length : 0} palavras • {value?.length || 0} caracteres
        </div>
        <div>
          {isPreview ? 'Modo visualização' : 'Modo edição'}
        </div>
      </div>
    </div>
  );
}
