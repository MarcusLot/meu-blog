import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts, Post } from '../../lib/posts'

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
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
        <h2>Todos os Posts</h2>
        <div className="posts-list">
          {posts.map((post) => (
            <article key={post.slug} className="post-item">
              <h3>
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              <p className="date">{post.date}</p>
              <p className="excerpt">{post.excerpt}</p>
            </article>
          ))}
        </div>
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
        .posts-list {
          margin: 2rem 0;
        }
        .post-item {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        .post-item h3 a {
          text-decoration: none;
          color: #333;
        }
        .post-item h3 a:hover {
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
