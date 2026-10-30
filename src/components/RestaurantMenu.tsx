import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Info } from 'lucide-react'
import { categories, dishes, formatPrice, type CategoryId, type Dish } from '../data/menu'
import { Eyebrow, Photo, Reveal } from './Primitives'
import { Modal } from './Modal'

export function RestaurantMenu() {
  const [category, setCategory] = useState<CategoryId>('starters')
  const [selected, setSelected] = useState<Dish | null>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const reduce = useReducedMotion()
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = categories.length - 1
    else return
    event.preventDefault()
    setCategory(categories[next].id)
    tabs.current[next]?.focus({ preventScroll: true })
  }
  return <section className="menu-section section" id="menu" aria-labelledby="menu-title" tabIndex={-1}>
    <div className="wrap">
      <Reveal className="section-heading"><div><Eyebrow>LA CARTE</Eyebrow><h2 id="menu-title">Вкус, который<br/><em>остаётся с вами.</em></h2></div><p className="section-intro">Французская классика с современным прочтением.<br/>Знакомые сочетания. Новые впечатления.</p></Reveal>
      <div className="menu-tabs" role="tablist" aria-label="Категории меню">{categories.map((tab, i) => <button ref={node => { tabs.current[i] = node }} id={`tab-${tab.id}`} key={tab.id} role="tab" aria-selected={category === tab.id} aria-controls="menu-panel" tabIndex={category === tab.id ? 0 : -1} onKeyDown={event => onKeyDown(event, i)} onClick={() => setCategory(tab.id)}>{tab.label}</button>)}</div>
      <div role="tabpanel" id="menu-panel" aria-labelledby={`tab-${category}`} tabIndex={0}>
        <AnimatePresence mode="wait" initial={false}><motion.div key={category} className="dish-grid" initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduce ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }}>
          {dishes.filter(dish => dish.category === category).map(dish => <article className="dish" key={dish.id}>
            <button className="dish-image-button" onClick={() => setSelected(dish)} aria-label={`Подробнее: ${dish.name}`}><Photo photo={dish.image} alt={dish.imageAlt} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 44vw, 29vw" width={700} height={600}/>{dish.tag && <span className="dish-tag">{dish.tag}</span>}<span className="dish-expand"><ArrowUpRight size={22} strokeWidth={1.3}/></span></button>
            <p className="dish-french" lang="fr">{dish.french}</p><div className="dish-title"><h3><button onClick={() => setSelected(dish)}>{dish.name}</button></h3><span>{formatPrice(dish.price)}</span></div><p className="dish-description">{dish.description}</p><div className="dish-meta"><span>{dish.portion}</span><button onClick={() => setSelected(dish)} aria-label={`Состав и аллергены: ${dish.name}`}><Info size={13}/>Состав и аллергены</button></div>
          </article>)}
        </motion.div></AnimatePresence>
      </div>
      <div className="menu-note"><p>Меню и цены вымышлены. Фотографии иллюстрируют стиль кухни и могут отличаться от описаний блюд.</p><span>ЦЕНЫ В ТЕНГЕ · ₸</span></div>
    </div>
    <Modal open={selected !== null} onClose={() => setSelected(null)} titleId="dish-detail-title" className="dish-modal">{selected && <><Photo photo={selected.image} alt={selected.imageAlt} sizes="(max-width: 639px) 100vw, 620px" width={700} height={450}/><div className="dish-detail"><p className="eyebrow" lang="fr">{selected.french}</p><h2 id="dish-detail-title">{selected.name}</h2><p>{selected.description}</p><div className="detail-price"><span>{selected.portion}</span><strong>{formatPrice(selected.price)}</strong></div><h3>Аллергены</h3><p>{selected.allergens.length ? selected.allergens.join(' · ') : 'В составе не указаны основные аллергены.'}</p><p className="small-note">Вымышленное блюдо для демонстрации интерфейса. Сведения об аллергенах относятся только к описанному составу.</p></div></>}</Modal>
  </section>
}
