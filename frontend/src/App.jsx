import { useEffect, useMemo, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { api } from './api'
import { tenant as fallbackTenant } from './config/tenant'

const demoQueue = {
  open: true, paused: false, averageWaitMinutes: 28,
  people: [
    { id: 1, displayName: 'Matheus S.', position: 1, status: 'WAITING' },
    { id: 2, displayName: 'João V.', position: 2, status: 'WAITING' },
    { id: 3, displayName: 'Carlos M.', position: 3, status: 'WAITING' }
  ]
}

function Icon({ name }) {
  const paths = {
    home: <><path d="M3 11 12 3l9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
    photos: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/>
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Brand({ shop, navigate }) {
  return <button className="brand" onClick={() => navigate('')} aria-label="Ir para o início"><span>DB</span><strong>{shop.name}</strong></button>
}

function Header({ shop, page, navigate }) {
  return <header className="topbar">
    {page ? <button className="back-button" onClick={() => navigate('')}><Icon name="back"/> Voltar</button> : <Brand shop={shop} navigate={navigate}/>} 
    <nav className="desktop-nav"><button onClick={() => navigate('')}>Início</button><button onClick={() => navigate('cortes')}>Cortes</button><button className="nav-primary" onClick={() => navigate('fila')}>VER FILA</button></nav>
    {page && <span className="route-title">{page === 'fila' ? 'Fila ao vivo' : 'Nossos cortes'}</span>}
  </header>
}

function StatusPill({ queue, connected }) {
  return <div className={`status-pill ${queue.open ? 'is-open' : 'is-closed'}`}><i/><div><small>{queue.open ? 'ABERTO AGORA' : 'FECHADO'}</small><strong>{queue.open ? `${queue.people.length} na fila · cerca de ${queue.averageWaitMinutes} min` : 'Fila indisponível'}</strong></div>{connected && <span>AO VIVO</span>}</div>
}

function HomePage({ shop, queue, connected, navigate }) {
  return <main className="home-page">
    <section className="hero-mobile">
      <div className="hero-image"><div className="hero-image-shade"/><StatusPill queue={queue} connected={connected}/><div className="hero-badge"><small>HOJE</small><strong>11h — 19h</strong></div></div>
      <div className="hero-content"><p className="eyebrow">{shop.eyebrow}</p><h1>{shop.headline}</h1><p>{shop.description}</p><button className="big-action" onClick={() => navigate('fila')}>ACOMPANHAR A FILA <Icon name="arrow"/></button></div>
    </section>

    <section className="today-card"><div className="today-icon"><Icon name="clock"/></div><div><small>AVISO DO DENIS</small><p>{shop.notice}</p></div></section>

    <section className="content-section" id="servicos">
      <div className="section-title"><p className="eyebrow">SERVIÇOS</p><h2>Escolha seu estilo.</h2><p>Preço claro, atendimento caprichado e fila organizada.</p></div>
      <div className="services-list">{shop.services.map((service, index) => <article key={service.name}><span className="service-number">0{index + 1}</span><div><h3>{service.name}</h3><p>{service.text}</p><small><Icon name="clock"/>{service.duration}</small></div><strong>{service.price}</strong></article>)}</div>
    </section>

    <section className="dark-section"><p className="eyebrow">SEM ESPERA À TOA</p><h2>Olhou a fila.<br/>Saiu de casa.<br/>Cortou.</h2><div className="steps"><div><span>1</span><p>Entre na fila pelo celular.</p></div><div><span>2</span><p>Acompanhe sua posição ao vivo.</p></div><div><span>3</span><p>Chegue perto da sua vez.</p></div></div><button className="big-action light" onClick={() => navigate('fila')}>VER FILA AGORA <Icon name="arrow"/></button></section>

    <section className="content-section portfolio-preview">
      <div className="section-title row"><div><p className="eyebrow">TRABALHOS</p><h2>Cortes que falam por si.</h2></div><button className="text-button" onClick={() => navigate('cortes')}>VER TODOS <Icon name="arrow"/></button></div>
      <div className="photo-grid preview">{shop.portfolio.map(item => <button key={item.id} className="photo-card" onClick={() => navigate('cortes')} style={{ backgroundImage: `url(${item.image})`, backgroundPosition: item.position }}><span>{item.category}</span><strong>{item.title}</strong></button>)}</div>
    </section>

    <section className="content-section reviews-section"><div className="section-title"><p className="eyebrow">QUEM CORTA, VOLTA</p><h2>Experiência de verdade.</h2></div><div className="reviews">{shop.reviews.map(review => <blockquote key={review.name}><span>★★★★★</span><p>“{review.text}”</p><footer>{review.name}</footer></blockquote>)}</div></section>

    <section className="location-section" id="local"><p className="eyebrow">ONDE ENCONTRAR</p><h2>Perto de você.</h2><div className="location-lines"><p><Icon name="pin"/><span>{shop.address}</span></p><p><Icon name="clock"/><span>{shop.hours}</span></p></div><a className="big-action" href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noreferrer"><Icon name="phone"/> CHAMAR NO WHATSAPP</a></section>
  </main>
}

function QueuePage({ shop, queue, setQueue, connected }) {
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [feedback, setFeedback] = useState(''); const [sending, setSending] = useState(false)
  async function submit(event) {
    event.preventDefault(); setSending(true); setFeedback('')
    try {
      const entry = await api.joinQueue(shop.slug, { name, phone }); localStorage.setItem(`queue-token:${shop.slug}`, entry.accessToken); setFeedback(`Tudo certo, ${entry.displayName}. Você está na posição ${entry.position}.`)
    } catch {
      const parts = name.trim().split(/\s+/); const displayName = parts.length > 1 ? `${parts[0]} ${parts.at(-1)[0].toUpperCase()}.` : name.trim()
      setQueue(current => ({ ...current, people: [...current.people, { id: Date.now(), displayName, position: current.people.length + 1, status: 'WAITING' }] })); setFeedback(`Demonstração: ${displayName}, você entrou na fila. Quando ligarmos a API, isso será salvo em tempo real.`)
    } finally { setSending(false); setName(''); setPhone('') }
  }
  return <main className="queue-page">
    <section className="queue-hero"><p className="eyebrow">FILA DO {shop.name.toUpperCase()}</p><h1>Chegue perto<br/>da sua vez.</h1><p>Veja quem está na frente e acompanhe a movimentação sem precisar perguntar no WhatsApp.</p><StatusPill queue={queue} connected={connected}/></section>
    <section className="queue-dashboard">
      <div className="queue-metrics"><div><span><Icon name="users"/></span><strong>{queue.people.length}</strong><small>pessoas aguardando</small></div><div><span><Icon name="clock"/></span><strong>~{queue.averageWaitMinutes}</strong><small>minutos estimados</small></div></div>
      <div className="queue-panel"><div className="queue-panel-title"><div><small>ORDEM ATUAL</small><h2>Fila agora</h2></div><span className="live-dot">ATUALIZANDO</span></div><ol>{queue.people.map(person => <li key={person.id}><span>{person.position}</span><div><strong>{person.displayName}</strong><small>{person.position === 1 ? 'Próximo atendimento' : `aprox. ${(person.position - 1) * queue.averageWaitMinutes} min`}</small></div>{person.position === 1 && <b>PRÓXIMO</b>}</li>)}</ol>{!queue.people.length && <div className="empty-queue"><Icon name="check"/><strong>Ninguém esperando</strong><p>Você pode ser o próximo.</p></div>}</div>
      <form className="join-card" onSubmit={submit}><div><small>ENTRE PELO CELULAR</small><h2>Guardar meu lugar</h2><p>Seu telefone fica protegido e seu nome aparece abreviado na fila.</p></div><label>Seu nome<input value={name} onChange={event => setName(event.target.value)} required minLength="2" maxLength="80" placeholder="Ex.: Gabriel Melo"/></label><label>Seu WhatsApp<input value={phone} onChange={event => setPhone(event.target.value)} required inputMode="tel" placeholder="(82) 99999-9999"/></label><button className="big-action" disabled={sending || !queue.open}>{sending ? 'ENTRANDO...' : 'ENTRAR NA FILA'} <Icon name="arrow"/></button>{feedback && <p className="form-feedback">{feedback}</p>}</form>
    </section>
  </main>
}

function GalleryPage({ shop }) {
  const [selected, setSelected] = useState(null)
  return <main className="gallery-page"><section className="gallery-heading"><p className="eyebrow">PORTFÓLIO DO BARBEIRO</p><h1>Escolha sua<br/>próxima versão.</h1><p>Alguns trabalhos para você chegar com a referência certa. As fotos reais do Denis serão adicionadas aqui.</p></section><section className="gallery-grid">{shop.portfolio.map((item, index) => <button key={item.id} className={`gallery-item item-${index + 1}`} onClick={() => setSelected(item)}><img src={item.image} alt={item.title} style={{ objectPosition: item.position }}/><div><small>{item.category}</small><strong>{item.title}</strong></div></button>)}</section><section className="gallery-cta"><p>Viu um corte que combina com você?</p><a href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent('Olá! Vi os cortes no site e quero conversar sobre o meu.')}`} target="_blank" rel="noreferrer">FALAR COM O DENIS <Icon name="arrow"/></a></section>{selected && <div className="photo-modal" onClick={() => setSelected(null)}><button aria-label="Fechar">×</button><img src={selected.image} alt={selected.title}/><div><small>{selected.category}</small><strong>{selected.title}</strong></div></div>}</main>
}

function BottomNav({ page, navigate }) {
  return <nav className="bottom-nav"><button className={!page ? 'active' : ''} onClick={() => navigate('')}><Icon name="home"/><span>Início</span></button><button className={page === 'fila' ? 'active featured' : 'featured'} onClick={() => navigate('fila')}><Icon name="users"/><span>Fila</span></button><button className={page === 'cortes' ? 'active' : ''} onClick={() => navigate('cortes')}><Icon name="photos"/><span>Cortes</span></button><button onClick={() => { navigate(''); setTimeout(() => document.querySelector('#local')?.scrollIntoView(), 50) }}><Icon name="pin"/><span>Local</span></button></nav>
}

function App() {
  const initial = window.location.pathname.split('/').filter(Boolean); const slug = initial[0] || fallbackTenant.slug
  const [page, setPage] = useState(initial[1] || ''); const [shop, setShop] = useState({ ...fallbackTenant, slug }); const [queue, setQueue] = useState(demoQueue); const [connected, setConnected] = useState(false)
  const queueCount = useMemo(() => queue.people.length, [queue.people.length])
  function navigate(nextPage) { history.pushState({}, '', `/${slug}${nextPage ? `/${nextPage}` : ''}`); setPage(nextPage); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  useEffect(() => { const onPopState = () => setPage(window.location.pathname.split('/').filter(Boolean)[1] || ''); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState) }, [])
  useEffect(() => {
    api.getShop(slug).then(remote => setShop(current => ({ ...current, ...remote }))).catch(() => {}); api.getQueue(slug).then(setQueue).catch(() => {})
    const websocketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/^http/, 'ws') + '/ws'
    const client = new Client({ brokerURL: websocketUrl, reconnectDelay: 5000, onConnect: () => { setConnected(true); client.subscribe(`/topic/barbershops/${slug}/queue`, message => setQueue(JSON.parse(message.body))) }, onWebSocketClose: () => setConnected(false) })
    client.activate(); return () => client.deactivate()
  }, [slug])
  return <div className="app-shell"><Header shop={shop} page={page} navigate={navigate}/>{page === 'fila' ? <QueuePage shop={shop} queue={queue} setQueue={setQueue} connected={connected}/> : page === 'cortes' ? <GalleryPage shop={shop}/> : <HomePage shop={shop} queue={queue} connected={connected} navigate={navigate}/>}<footer className="site-footer"><Brand shop={shop} navigate={navigate}/><p>Barbearia, portfólio e fila em um só lugar.</p><small>© {new Date().getFullYear()} {shop.name}</small></footer><BottomNav page={page} navigate={navigate}/>{page !== 'fila' && <button className="floating-queue" onClick={() => navigate('fila')}><span>{queueCount}</span><div><small>FILA AGORA</small><strong>ACOMPANHAR</strong></div><Icon name="arrow"/></button>}</div>
}

export default App
