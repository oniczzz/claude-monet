import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { dishes, formatPrice } from '../data/menu'
import { Eyebrow, Photo, TextLink } from './Primitives'
const signatureDishes = [dishes.find(d => d.id === 'filet')!, dishes.find(d => d.id === 'salmon')!, dishes.find(d => d.id === 'brulee')!]
const stories = [
  'Точная прожарка. Бархатистый соус. Ничего лишнего. Наше прочтение французской классики, в котором главный голос всегда остаётся за продуктом.',
  'Нежный лосось и лёгкая кислинка бер-блана. Соус, который превращает простое сочетание в маленькое гастрономическое путешествие.',
  'Тот самый звук, когда ложка ломает тонкую карамельную корочку. Ваниль, нежность и идеальный повод задержаться ещё немного.',
]
export function Signature() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const dish = signatureDishes[index]
  return <section className="signature-section" id="signature" aria-labelledby="signature-title" tabIndex={-1}>
    <div className="signature-photo"><AnimatePresence mode="wait" initial={false}><motion.div key={dish.id} initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduce ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.3 }}><Photo photo={dish.image} alt={dish.imageAlt} sizes="(max-width: 767px) 100vw, 55vw" width={1100} height={1100}/></motion.div></AnimatePresence><span className="signature-photo-label">LES SIGNATURES DE LA MAISON</span></div>
    <div className="signature-copy"><Eyebrow>ФИРМЕННЫЕ БЛЮДА</Eyebrow><h2 id="signature-title">Почерк<br/><em>нашей кухни.</em></h2><div className="signature-description" aria-live="polite" aria-atomic="true"><p className="signature-french" lang="fr">{dish.french}</p><h3>{dish.name}</h3><p>{stories[index]}</p><span className="signature-price">{formatPrice(dish.price)}<small>{dish.portion}</small></span></div><TextLink href="#menu" light>Открыть меню</TextLink><div className="signature-controls"><span><b>0{index + 1}</b> / 03</span><div className="flex gap-3"><button className="icon-button round-button" aria-label="Предыдущее фирменное блюдо" onClick={() => setIndex((index + 2) % 3)}><ArrowLeft size={19}/></button><button className="icon-button round-button" aria-label="Следующее фирменное блюдо" onClick={() => setIndex((index + 1) % 3)}><ArrowRight size={19}/></button></div></div></div>
  </section>
}
