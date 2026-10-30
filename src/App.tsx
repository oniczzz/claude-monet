import { MotionConfig } from 'motion/react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Story } from './components/Story'
import { RestaurantMenu } from './components/RestaurantMenu'
import { Signature } from './components/Signature'
import { Gallery } from './components/Gallery'
import { Atmosphere } from './components/Atmosphere'
import { Reservation } from './components/Reservation'
import { Footer } from './components/Footer'

export default function App() {
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main-content">Перейти к содержимому</a><Header/><main id="main-content" tabIndex={-1}><Hero/><Story/><RestaurantMenu/><Signature/><Gallery/><Atmosphere/><Reservation/></main><Footer/></MotionConfig>
}
