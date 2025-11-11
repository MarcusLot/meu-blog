import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, PrimaryButton, DangerButton } from '../ui/Button';
import { TextInput, DateInput } from '../ui/Input';
import { Alert, SuccessAlert, ErrorAlert } from '../ui/Alert';
import MarkdownEditor from '../editor/MarkdownEditor';
import { createPost, updatePost, Post } from '../../lib/posts';

// Esquema de validação usando Yup
const postSchema = yup.object().shape({
  title: yup.string().required('O título é obrigatório').min(3, 'O título deve ter pelo menos 3 caracteres'),
  excerpt: yup.string().required('O resumo é obrigatório').max(300, 'O resumo deve ter no máximo 300 caracteres'),
  date: yup.string().required('A data é obrigatória'),
  content: yup.string().required('O conteúdo é obrigatório').min(10, 'O conteúdo deve ter pelo menos 10 caracteres'),
});

type PostFormData = yup.InferType<typeof postSchema>;

interface PostFormProps {
  post?: Post; // Post existente para edição
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PostForm({ post, onSuccess, onCancel }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      date: post?.date || new Date().toISOString().split('T')[0],
      content: post?.content || '',
    },
  });

  // Atualiza o valor do conteúdo quando o editor mudar
  const handleContentChange = (content: string) => {
    setValue('content', content, { shouldValidate: true });
  };

  // Submissão do formulário
  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (post) {
        // Atualizar post existente
        const result = await updatePost(post.slug, data);
        if (result.success) {
          setSubmitSuccess(true);
          if (onSuccess) onSuccess();
          // Atualiza a URL se o slug mudou
          const newSlug = data.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
          
          if (newSlug !== post.slug) {
            router.replace(`/admin/posts/editar/${newSlug}`);
          }
        } else {
          throw new Error(result.error || 'Erro ao atualizar o post');
        }
      } else {
        // Criar novo post
        const result = await createPost(data);
        if (result.success && result.slug) {
          setSubmitSuccess(true);
          // Redireciona para a página de edição do novo post
          router.push(`/admin/posts/editar/${result.slug}`);
          if (onSuccess) onSuccess();
        } else {
          throw new Error(result.error || 'Erro ao criar o post');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar o post:', error);
      setSubmitError(error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efeito para resetar o formulário quando o post mudar
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        content: post.content,
      });
    }
  }, [post, reset]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {post ? 'Editar Post' : 'Novo Post'}
        </h2>
        <div className="flex space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <PrimaryButton
            type="button"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </PrimaryButton>
        </div>
      </div>

      {submitSuccess && (
        <SuccessAlert
          title="Sucesso!"
          message="O post foi salvo com sucesso."
          onClose={() => setSubmitSuccess(false)}
        />
      )}

      {submitError && (
        <ErrorAlert
          title="Erro ao salvar o post"
          message={submitError}
          onClose={() => setSubmitError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <TextInput
            label="Título"
            id="title"
            {...register('title')}
            error={errors.title}
            placeholder="Digite o título do post"
          />

          <TextInput
            label="Resumo"
            id="excerpt"
            {...register('excerpt')}
            error={errors.excerpt}
            placeholder="Um breve resumo do post (máx. 300 caracteres)"
            maxLength={300}
          />

          <DateInput
            label="Data de publicação"
            id="date"
            {...register('date')}
            error={errors.date}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo
              {errors.content && (
                <span className="ml-1 text-sm font-normal text-red-600">
                  {errors.content.message}
                </span>
              )}
            </label>
            <div className={errors.content ? 'ring-1 ring-red-500 rounded-md' : ''}>
              <MarkdownEditor
                value={watch('content')}
                onChange={handleContentChange}
                placeholder="Escreva o conteúdo do seu post aqui..."
                minHeight="400px"
              />
            </div>
            <input type="hidden" {...register('content')} />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {post && (
            <DangerButton
              type="button"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
                  // Implementar lógica de exclusão
                  console.log('Excluir post:', post.slug);
                }
              }}
              disabled={isSubmitting}
            >
              Excluir Post
            </DangerButton>
          )}
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Post'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
