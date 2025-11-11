// Configurações do painel administrativo
export const adminConfig = {
  // Credenciais de login (em produção, use um sistema de autenticação seguro)
  credentials: {
    email: 'admin@exemplo.com',
    password: 'admin123',
  },
  
  // Configurações de posts
  posts: {
    // Diretório onde os posts são armazenados
    directory: 'content/posts',
    // Extensão dos arquivos de post
    extension: '.md',
    // Formato da data para os nomes dos arquivos
    dateFormat: 'yyyy-MM-dd',
  },
  
  // Configurações de upload de mídia
  uploads: {
    // Diretório para upload de imagens e outros arquivos de mídia
    directory: 'public/uploads',
    // Tipos de arquivo permitidos
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    // Tamanho máximo do arquivo em bytes (5MB)
    maxFileSize: 5 * 1024 * 1024,
  },
  
  // Configurações de SEO padrão
  seo: {
    siteName: 'Meu Blog',
    defaultDescription: 'Um blog sobre tecnologia e desenvolvimento',
    defaultImage: '/images/default-og.jpg',
    twitterHandle: '@meublog',
  },
  
  // Configurações de tema
  theme: {
    primaryColor: '#2563eb', // blue-600
    secondaryColor: '#1d4ed8', // blue-700
    accentColor: '#1e40af', // blue-800
  },
};

export default adminConfig;
