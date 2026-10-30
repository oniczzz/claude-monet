import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { images } from '../data/images'
import { Ornament, Photo } from './Primitives'
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  return <>
    <section className="hero" id="home" ref={ref} aria-labelledby="hero-title" tabIndex={-1}>
      <motion.div className="hero-image" style={{ y: reduce ? 0 : y }}><Photo photo={images.interior} alt="Тёплый свет подвесных ламп в просторном ресторанном зале" loading="eager" fetchPriority="high" sizes="100vw" width={1920} height={1280}/></motion.div>
      <div className="hero-shade"/>
      <div className="hero-frame" aria-hidden="true"/>
      <motion.div className="hero-content" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}>
        <Ornament className="hero-ornament"/>
        <p className="hero-kicker">ФРАНЦУЗСКАЯ КУХНЯ. ИСКУССТВО ЖИТЬ.</p>
        <h1 id="hero-title">CLAUDE <span>MONET</span></h1>
        <p className="hero-slogan">Искусство неспешного вечера</p>
        <div className="hero-actions"><a className="button button-cream" href="#menu">Посмотреть меню<ArrowUpRight size={17}/></a><a className="button button-outline" href="#reservation">Забронировать стол<ArrowUpRight size={17}/></a></div>
      </motion.div>
      <div className="hero-bottom"><span>PARISIAN SOUL.<br/>FRENCH CUISINE.</span><a href="#story" aria-label="Перейти к истории ресторана" className="scroll-cue"><ArrowDown size={19} strokeWidth={1}/><span>ОТКРОЙТЕ НАШУ ИСТОРИЮ</span></a><span className="hero-concept">НЕОФИЦИАЛЬНЫЙ<br/>ДИЗАЙН-КОНЦЕПТ</span></div>
    </section>
    <div className="intro-strip" aria-label="Философия ресторана"><span>Французская классика</span><i aria-hidden="true">✧</i><span>Сезонные акценты</span><i aria-hidden="true">✧</i><span>Тепло в каждой детали</span></div>
  </>
}
