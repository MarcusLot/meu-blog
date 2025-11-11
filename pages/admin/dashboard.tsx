import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getPosts, Post } from '../../../lib/posts';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // Carregar posts
    const loadPosts = async () => {
      try {
        const postsData = getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [router]);

  const handleDelete = async (slug: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        // Aqui você implementaria a lógica para excluir o post
        // Por enquanto, apenas removemos da lista local
        setPosts(posts.filter(post => post.slug !== slug));
        alert('Post excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir post:', error);
        alert('Erro ao excluir o post. Tente novamente.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Painel de Controle - Meu Blog</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Painel de Controle</h1>
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              target="_blank"
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Gerenciar Posts</h2>
          <Link
            href="/admin/posts/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Novo Post
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {posts.length > 0 ? (
              posts.map((post) => (
                <li key={post.slug}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {post.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <Link
                          href={`/admin/posts/editar/${post.slug}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Link 
                          href={`/posts/${post.slug}`} 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visualizar
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                Nenhum post encontrado.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
