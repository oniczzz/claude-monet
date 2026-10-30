import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { navigation } from './Header'
import { Eyebrow, Ornament } from './Primitives'
import { Modal } from './Modal'
export function Footer() {
  const [aboutOpen, setAboutOpen] = useState(false)
  return <footer className="footer" id="contacts" tabIndex={-1}>
    <div className="wrap"><div className="footer-top"><div className="footer-invitation"><Eyebrow>À BIENTÔT</Eyebrow><h2>До встречи<br/><em>в прекрасном.</em></h2><p>Вдохновлено Францией.<br/>Создано с любовью к деталям.</p></div><div className="footer-column"><h3>Ваш вечер</h3><nav aria-label="Навигация в подвале">{navigation.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}<a href="#reservation">Бронирование · демо<ArrowUpRight size={13}/></a></nav></div><div className="footer-column footer-contacts"><h3>Контакты <span>Демо</span></h3><p>Алматы, ул. Воображаемая, 12<br/><small>Вымышленный адрес</small></p><p>+7 (000) 000-00-00<br/>bonjour@claude-monet.example</p><h3 className="hours-title">Часы работы <span>Демо</span></h3><p>Ежедневно · 12:00–23:00<br/><small>Ресторан существует только в этом концепте.</small></p></div></div>
      <div className="footer-brand"><span>CLAUDE</span><Ornament/><span>MONET</span></div><div className="footer-bottom"><p>© {new Date().getFullYear()} CLAUDE MONET<br/><span>Портфолио · Французский ресторан</span></p><p className="legal-notice">Неофициальный фанатский дизайн-концепт по мотивам сериала „Кухня“. Не связан с правообладателями. Бронирование демонстрационное.</p><button className="footer-about" onClick={() => setAboutOpen(true)}>О проекте<ArrowUpRight size={14}/></button></div>
    </div>
    <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} titleId="about-title" className="about-modal"><Ornament/><Eyebrow>НЕЗАВИСИМЫЙ ТВОРЧЕСКИЙ ПРОЕКТ</Eyebrow><h2 id="about-title">Знакомая история.<br/><em>Авторский взгляд.</em></h2><p>CLAUDE MONET — портфолио-проект веб-разработчика. Название и отсылка к сериалу «Кухня» используются для обозначения неофициального фанатского концепта. Это не сайт действующего ресторана.</p><p>Меню, цены, адрес, часы работы и контакты вымышлены. Форма ничего не отправляет; её содержимое хранится только в памяти вкладки. Здесь нет аналитики, рекламных cookies и настоящей оплаты.</p><p>Использованы фотографии ресторанной атмосферы и еды с Unsplash. Они не изображают ресторан из сериала. Официальные логотипы, кадры и фотографии актёров не используются.</p><p className="small-note">Реестр исходных фотографий и лицензий включён в проект: public/IMAGE_CREDITS.md. Сведения о шрифтах — public/FONT_LICENSES.md.</p></Modal>
  </footer>
}
