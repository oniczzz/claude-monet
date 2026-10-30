import { images } from '../data/images'
import { Eyebrow, Photo, Reveal, TextLink } from './Primitives'
export function Story() {
  return <section id="story" className="story section wrap" aria-labelledby="story-title" tabIndex={-1}>
    <Reveal className="story-visual"><div className="story-main-photo"><Photo photo={images.table} alt="Элегантная сервировка: бокалы и белый фарфор в мягком вечернем свете" sizes="(max-width: 767px) 85vw, 42vw" width={800} height={1000}/></div><div className="story-inset"><Photo photo={images.bread} alt="Золотистый свежий хлеб с хрустящей корочкой" sizes="(max-width: 767px) 45vw, 21vw" width={500} height={600}/><span>Le goût des choses simples</span></div><span className="vertical-caption">L’HISTOIRE DE NOTRE MAISON</span></Reveal>
    <Reveal className="story-copy" delay={0.12}><Eyebrow>ЗНАКОМОЕ ИМЯ. НОВАЯ ИСТОРИЯ.</Eyebrow><h2 id="story-title">Чуть ближе<br/>к Парижу.<br/><em>Чуть дальше<br/>от суеты.</em></h2><p>Есть места, куда приходят за ужином.<br className="desktop-break"/> И места, где хочется остаться на целый вечер.</p><p>Мы представили CLAUDE MONET именно таким: с ароматом тёплого багета, тихим звоном бокалов и французской кухней, в которой за каждой деталью чувствуется характер.</p><p>Этот независимый концепт вдохновлён атмосферой сериала «Кухня» — любовью к гастрономии, живыми историями и маленькими драмами за дверями большого ресторана.</p><TextLink href="#atmosphere">Почувствовать атмосферу</TextLink><div className="story-signature" aria-hidden="true">Avec amour, Claude Monet</div></Reveal>
  </section>
}
