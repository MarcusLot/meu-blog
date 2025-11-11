// Tipos para os posts
export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  // Adicione outros campos conforme necessário
}

// Tipos para as props dos componentes
export interface PostsListProps {
  posts: Post[];
}

export interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  date: string;
}

// Tipos para a API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipos para autenticação
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
}

// Tipos para upload de arquivos
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

// Tipos para configurações do site
export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  baseUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

// Tipos para estatísticas do painel
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  recentPosts: Array<{
    title: string;
    views: number;
    slug: string;
  }>;
}
