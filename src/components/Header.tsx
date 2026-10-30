import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu } from 'lucide-react'
import { Modal } from './Modal'

export const navigation = [
  { href: '#story', label: 'О ресторане' },
  { href: '#menu', label: 'Меню' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#atmosphere', label: 'Атмосфера' },
  { href: '#contacts', label: 'Контакты' },
]
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50)
    update()
    window.addEventListener('scroll', update, { passive: true })
    const desktop = window.matchMedia('(min-width: 1024px)')
    const resize = () => { if (desktop.matches) setMobileOpen(false) }
    desktop.addEventListener('change', resize)
    return () => { window.removeEventListener('scroll', update); desktop.removeEventListener('change', resize) }
  }, [])
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault()
    setMobileOpen(false)
    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(hash)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      history.replaceState(null, '', hash)
    }, 0)
  }
  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#home" className="wordmark" aria-label="Claude Monet — на главную"><span>CLAUDE MONET</span><small>CUISINE FRANÇAISE</small></a>
      <nav className="desktop-nav" aria-label="Основная навигация">{navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <a className="header-book" href="#reservation">Забронировать стол<ArrowUpRight size={15}/></a>
      <button className="icon-button mobile-toggle" aria-label="Открыть меню" aria-expanded={mobileOpen} aria-controls={mobileOpen ? 'mobile-navigation' : undefined} onClick={() => setMobileOpen(true)}><Menu size={25} strokeWidth={1.3}/></button>
    </header>
    <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} titleId="mobile-menu-title" className="mobile-menu">
      <div className="wordmark" id="mobile-menu-title"><span>CLAUDE MONET</span><small>CUISINE FRANÇAISE</small></div>
      <nav id="mobile-navigation" aria-label="Мобильная навигация">{navigation.map((link, i) => <a key={link.href} href={link.href} onClick={event => navigate(event, link.href)}><small>0{i + 1}</small>{link.label}<ArrowUpRight size={22}/></a>)}</nav>
      <a href="#reservation" className="button button-burgundy" onClick={event => navigate(event, '#reservation')}>Забронировать стол<ArrowUpRight size={17}/></a>
      <p className="small-note">Фанатский дизайн-концепт.<br/>Бронирование демонстрационное.</p>
    </Modal>
  </>
}
