import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { v4 as uuidv4 } from 'uuid';

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export function getPosts(): Post[] {
  // Cria o diretório de posts se não existir
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      try {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || '',
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          content: content || '',
        };
      } catch (error) {
        console.error(`Erro ao processar o arquivo ${fileName}:`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null);

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      content: content || '',
    };
  } catch (error) {
    console.error(`Erro ao carregar o post ${slug}:`, error);
    return null;
  }
}

export function createPost(postData: Omit<Post, 'slug'>): { success: boolean; slug?: string; error?: string } {
  try {
    // Garante que o diretório de posts existe
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // Gera um slug a partir do título
    const slug = postData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/--+/g, '-') // Remove múltiplos hífens consecutivos
      .replace(/^-+|-+$/g, '') // Remove hífens do início e do fim
      .substring(0, 50) // Limita o tamanho do slug
      .trim();

    // Adiciona um identificador único para evitar colisões
    const uniqueSlug = `${slug}-${uuidv4().substring(0, 8)}`;
    const fullPath = path.join(postsDirectory, `${uniqueSlug}.md`);
    
    // Cria o conteúdo do arquivo markdown
    const frontmatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
date: ${postData.date}
excerpt: "${postData.excerpt.replace(/"/g, '\\"')}"
---

${postData.content}`;

    // Salva o arquivo
    fs.writeFileSync(fullPath, frontmatter, 'utf8');
    
    return { success: true, slug: uniqueSlug };
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao criar o post' 
    };
  }
}

export function updatePost(slug: string, postData: Omit<Post, 'slug'>): { success: boolean; error?: string } {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Verifica se o arquivo existe
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: 'Post não encontrado' };
    }
    
    // Cria o conteúdo do arquivo markdown atualizado
    const frontmatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
date: ${postData.date}
excerpt: "${postData.excerpt.replace(/"/g, '\\"')}"
---

${postData.content}`;

    // Atualiza o arquivo
    fs.writeFileSync(fullPath, frontmatter, 'utf8');
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar o post' 
    };
  }
}

export function deletePost(slug: string): { success: boolean; error?: string } {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Verifica se o arquivo existe
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: 'Post não encontrado' };
    }
    
    // Remove o arquivo
    fs.unlinkSync(fullPath);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao excluir o post' 
    };
  }
}

// Função auxiliar para gerar um slug a partir de uma string
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Remove múltiplos hífens consecutivos
    .replace(/^-+|-+$/g, '') // Remove hífens do início e do fim
    .substring(0, 50) // Limita o tamanho do slug
    .trim();
}
