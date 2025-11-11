import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPostBySlug, Post } from '../../../../../lib/posts';
import AdminLayout from '../../../../components/admin/AdminLayout';
import PostForm from '../../../../components/admin/PostForm';

export default function EditarPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // Carregar post se existir um slug
    if (slug) {
      loadPost();
    } else {
      setIsLoading(false);
    }
  }, [router, slug]);

  const loadPost = () => {
    try {
      const postData = getPostBySlug(slug as string);
      if (postData) {
        setPost({
          ...postData,
          // Garantir que a data está no formato correto
          date: new Date(postData.date).toISOString().split('T')[0],
        });
      } else {
        console.error('Post não encontrado');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    // Recarregar o post após salvar para garantir que temos os dados mais recentes
    loadPost();
  };

  const handleCancel = () => {
    router.push('/admin/dashboard');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Carregando...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout title="Post não encontrado">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Post não encontrado</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              O post que você está tentando editar não foi encontrado.
            </p>
          </div>
          <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para o painel
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editando: ${post.title}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PostForm 
          post={post} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </AdminLayout>
  );
}
