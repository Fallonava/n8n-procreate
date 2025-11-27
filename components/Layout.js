export default function Layout({ children }) {
  return (
    <div className="layout">
      {children}
      
      <footer className="footer">
        <p>Deployed on Vercel</p>
      </footer>
    </div>
  )
}