import { Component, useState, type ErrorInfo, type ReactNode, type ImgHTMLAttributes } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { imageUrl } from '../data/images'

export function Ornament({ className = '' }: { className?: string }) {
  return <svg className={className} width="68" height="56" viewBox="0 0 68 56" fill="none" aria-hidden="true"><path d="M34 46V15M34 36C18 36 15 24 14 17c12 2 20 8 20 19Zm0 0c16 0 19-12 20-19-12 2-20 8-20 19ZM34 23c-8-5-8-12 0-21 8 9 8 16 0 21Z" stroke="currentColor" strokeWidth=".85"/><path d="M30 46h8M23 51h22M12 39c-7-7-7-16-6-20m50 20c7-7 7-16 6-20M17 44C9 45 4 40 2 35m49 9c8 1 13-4 15-9" stroke="currentColor" strokeWidth=".85"/></svg>
}
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
interface PhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> { photo: string; widthHint?: number }
export function Photo({ photo, widthHint = 1000, alt = '', loading = 'lazy', className = '', ...props }: PhotoProps) {
  const [failed, setFailed] = useState(false)
  return <img {...props} alt={alt} className={`photo ${className}`} loading={loading} decoding="async" src={failed ? `${import.meta.env.BASE_URL}image-fallback.svg` : imageUrl(photo, widthHint)} srcSet={failed ? undefined : `${imageUrl(photo, 480)} 480w, ${imageUrl(photo, 800)} 800w, ${imageUrl(photo, 1200)} 1200w, ${imageUrl(photo, 1920)} 1920w`} onError={() => setFailed(true)} />
}
export function TextLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <a className={`text-link ${light ? 'text-link-light' : ''}`} href={href}>{children}<ArrowUpRight size={17} strokeWidth={1.4}/></a>
}
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}><span aria-hidden="true" />{children}</p>
}
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('CLAUDE MONET render error', error, info.componentStack) }
  render() {
    if (this.state.hasError) return <main className="error-page"><Ornament/><h1>Небольшой антракт</h1><p>Не удалось отобразить страницу. Попробуйте перезагрузить её.</p><button className="button button-burgundy" onClick={() => window.location.reload()}>Обновить страницу</button><p className="small-note">CLAUDE MONET · Неофициальный дизайн-концепт</p></main>
    return this.props.children
  }
}
