import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { TemplatesProvider } from '../contexts/TemplatesContext'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <TemplatesProvider>
        <Component {...pageProps} />
      </TemplatesProvider>
    </ThemeProvider>
  )
}