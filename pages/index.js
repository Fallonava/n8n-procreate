import Head from 'next/head'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>N8N Procreate</title>
        <meta name="description" content="A clean Next.js application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <h1 className="title">
          Welcome to <span>N8N Procreate</span>
        </h1>
        
        <div className="grid">
          <div className="card">
            <h3>Getting Started</h3>
            <p>Your application is ready to deploy!</p>
          </div>
          
          <div className="card">
            <h3>Features</h3>
            <ul>
              <li>Next.js 13</li>
              <li>React 18</li>
              <li>Vercel Ready</li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  )
}