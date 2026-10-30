import { images } from '../data/images'
import { Eyebrow, Ornament, Photo, Reveal, TextLink } from './Primitives'
export function Atmosphere() {
  return <section className="atmosphere-section" id="atmosphere" aria-labelledby="atmosphere-title" tabIndex={-1}>
    <div className="wrap atmosphere-inner"><div className="atmosphere-photo atmosphere-photo-left"><Photo photo={images.wine} alt="Красное вино в бокале" sizes="25vw" width={450} height={650}/></div><Reveal className="atmosphere-copy"><Ornament/><Eyebrow>L’ART DE VIVRE</Eyebrow><h2 id="atmosphere-title">У хорошего вечера<br/>нет рецепта.<br/><em>Есть атмосфера.</em></h2><p>Разговор, который не хочется заканчивать. Любимый вкус. Время, которое наконец принадлежит вам. Французское искусство жить начинается с простых вещей — и людей рядом.</p><TextLink href="#reservation">Спланировать свой вечер</TextLink></Reveal><div className="atmosphere-photo atmosphere-photo-right"><Photo photo={images.coffee} alt="Кофе в керамической чашке" sizes="22vw" width={450} height={600}/></div></div>
    <div className="atmosphere-bottom"><span>LE TEMPS DE SAVOURER</span><span>ВРЕМЯ НАСЛАЖДАТЬСЯ</span></div>
  </section>
}
