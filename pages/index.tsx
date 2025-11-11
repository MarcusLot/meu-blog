import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts, Post } from '../lib/posts'

interface HomeProps {
  posts: Post[]
}

export default function Home({ posts }: HomeProps) {
  return (
    <div className="container">
      <header>
        <h1>Meu Blog</h1>
        <nav>
          <Link href="/">Início</Link>
          <Link href="/posts">Posts</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Bem-vindo ao meu blog</h2>
          <p>Um espaço para compartilhar ideias e conhecimentos</p>
        </section>

        <section className="recent-posts">
          <h3>Posts Recentes</h3>
          <div className="posts-grid">
            {posts.slice(0, 3).map((post) => (
              <article key={post.slug} className="post-card">
                <h4>
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h4>
                <p className="date">{post.date}</p>
                <p className="excerpt">{post.excerpt}</p>
              </article>
            ))}
          </div>
          <Link href="/posts" className="see-all">
            Ver todos os posts
          </Link>
        </section>
      </main>

      <style jsx>{`
        .container {
          max-width: 1200px;
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
        .hero {
          text-align: center;
          padding: 4rem 0;
        }
        .hero h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .recent-posts {
          padding: 2rem 0;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
        .post-card {
          border: 1px solid #eee;
          padding: 1.5rem;
          border-radius: 8px;
        }
        .post-card h4 a {
          text-decoration: none;
          color: #333;
        }
        .post-card h4 a:hover {
          color: #0070f3;
        }
        .date {
          color: #666;
          font-size: 0.9rem;
        }
        .excerpt {
          color: #555;
          line-height: 1.6;
        }
        .see-all {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPosts()
  return {
    props: {
      posts,
    },
  }
}
