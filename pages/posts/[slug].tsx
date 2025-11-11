import { GetStaticProps, GetStaticPaths } from 'next'
import { getPosts, getPostBySlug, Post } from '../../lib/posts'
import ReactMarkdown from 'react-markdown'

interface PostProps {
  post: Post
}

export default function PostPage({ post }: PostProps) {
  return (
    <div className="container">
      <header>
        <h1>Meu Blog</h1>
        <nav>
          <a href="/">Início</a>
          <a href="/posts">Posts</a>
        </nav>
      </header>

      <main>
        <article className="post">
          <h1>{post.title}</h1>
          <p className="date">{post.date}</p>
          <div className="content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          border-bottom: 1px solid #eee;
        }
        nav a {
          margin-left: 1rem;
          text-decoration: none;
          color: #333;
        }
        nav a:hover {
          color: #0070f3;
        }
        .post {
          margin: 2rem 0;
        }
        .post h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .date {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .content {
          line-height: 1.8;
          font-size: 1.1rem;
        }
        .content h2 {
          margin: 2rem 0 1rem 0;
        }
        .content p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params?.slug as string)
  return {
    props: {
      post,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}
