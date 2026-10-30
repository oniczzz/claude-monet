import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react'
import { images } from '../data/images'
import { Eyebrow, Photo, Reveal } from './Primitives'
import { Modal } from './Modal'
const gallery = [
  { photo: images.room, title: 'Там, где начинается вечер', subtitle: 'Свет, дерево и неспешные разговоры', alt: 'Уютный интерьер ресторана с деревянной мебелью и тёплым светом' },
  { photo: images.salmon, title: 'Внимание к каждому штриху', subtitle: 'Вкус в деталях', alt: 'Лосось с сезонными овощами на тарелке' },
  { photo: images.wine, title: 'За прекрасные мгновения', subtitle: 'Искусство наслаждаться', alt: 'Бокал вина в вечернем свете' },
  { photo: images.table, title: 'Ваш любимый столик', subtitle: 'Ещё один повод остаться', alt: 'Ресторанный стол с белым фарфором и прозрачными бокалами' },
]
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (index === null) return
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); setIndex(current => current === null ? null : (current + 1) % gallery.length) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setIndex(current => current === null ? null : (current - 1 + gallery.length) % gallery.length) }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [index])
  const selected = index !== null ? gallery[index] : null
  return <section id="gallery" className="gallery-section section wrap" aria-labelledby="gallery-title" tabIndex={-1}>
    <Reveal className="section-heading"><div><Eyebrow>QUELQUES INSTANTS</Eyebrow><h2 id="gallery-title">Красота<br/><em>обычного момента.</em></h2></div><p className="section-intro">Мягкий свет. Накрытый стол.<br/>И предчувствие прекрасного вечера.</p></Reveal>
    <div className="gallery-grid">{gallery.map((item, i) => <Reveal className={`gallery-item gallery-item-${i + 1}`} key={item.photo} delay={i * 0.05}><button onClick={() => setIndex(i)} aria-label={`Открыть фото: ${item.title}`}><Photo photo={item.photo} alt={item.alt} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 50vw" width={1000} height={850}/><span className="gallery-overlay"><span><small>0{i + 1} / CLAUDE MONET</small><strong>{item.title}</strong></span><Expand size={22} strokeWidth={1.2}/></span></button></Reveal>)}</div>
    <p className="gallery-footnote">Визуальное настроение концепта · фотографии независимых авторов, не кадры сериала</p>
    <Modal open={index !== null} onClose={() => setIndex(null)} titleId="gallery-lightbox-title" className="lightbox">
      {selected && <><div className="lightbox-top"><span>CLAUDE MONET</span><span>{String(index! + 1).padStart(2, '0')} / 04</span></div><AnimatePresence mode="wait" initial={false}><motion.div key={selected.photo} className="lightbox-image" initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduce ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.18 }}><Photo photo={selected.photo} alt={selected.alt} widthHint={1920} loading="eager" sizes="95vw"/></motion.div></AnimatePresence><div className="lightbox-bottom"><button className="icon-button round-button" aria-label="Предыдущее фото" onClick={() => setIndex((index! + 3) % 4)}><ArrowLeft size={22}/></button><div aria-live="polite"><h2 id="gallery-lightbox-title">{selected.title}</h2><p>{selected.subtitle}</p></div><button className="icon-button round-button" aria-label="Следующее фото" onClick={() => setIndex((index! + 1) % 4)}><ArrowRight size={22}/></button></div><p className="lightbox-hint">← → смена фото <span>·</span> Esc закрыть</p></>}
    </Modal>
  </section>
}
