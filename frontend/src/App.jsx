import { useEffect, useMemo, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { api } from './api'
import { tenant as fallbackTenant } from './config/tenant'

const demoQueue = {
  open: true,
  paused: false,
  averageWaitMinutes: 28,
  people: [
    { id: 1, displayName: 'Matheus S.', position: 1, status: 'WAITING' },
    { id: 2, displayName: 'João V.', position: 2, status: 'WAITING' },
    { id: 3, displayName: 'Carlos M.', position: 3, status: 'WAITING' }
  ]
}

function Icon({ name }) {
  const paths = {
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
    scissors: <><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.7 8.3 11.3 6.2M8.7 15.7 20 9.5"/></>
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function QueuePanel({ shop, queue, onClose, onJoined }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [feedback, setFeedback] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSending(true)
    setFeedback('')
    try {
      const entry = await api.joinQueue(shop.slug, { name, phone })
      localStorage.setItem(`queue-token:${shop.slug}`, entry.accessToken)
      setFeedback(`Pronto, ${entry.displayName}. Você entrou na posição ${entry.position}.`)
      setName('')
      setPhone('')
      onJoined()
    } catch {
      setFeedback('Modo demonstração: a API será conectada no próximo marco.')
    } finally {
      setSending(false)
    }
  }

  return <div className="queue-overlay" role="dialog" aria-modal="true" aria-label="Fila ao vivo">
    <div className="queue-sheet">
      <button className="close" onClick={onClose} aria-label="Fechar">×</button>
      <p className="kicker">FILA AO VIVO</p>
      <h2>Chegue perto da sua vez.</h2>
      <div className="queue-summary">
        <div><strong>{queue.people.length}</strong><span>pessoas na fila</span></div>
        <div><strong>~{queue.averageWaitMinutes} min</strong><span>espera estimada</span></div>
      </div>
      <ol className="queue-list">
        {queue.people.map(person => <li key={person.id}><span>{person.position}</span><strong>{person.displayName}</strong><small>{person.position === 1 ? 'Próximo' : `aprox. ${(person.position - 1) * queue.averageWaitMinutes} min`}</small></li>)}
      </ol>
      <form className="join-form" onSubmit={submit}>
        <h3>Entrar na fila</h3>
        <label>Seu nome<input value={name} onChange={e => setName(e.target.value)} minLength="2" maxLength="80" required placeholder="Ex.: Gabriel" /></label>
        <label>WhatsApp<input value={phone} onChange={e => setPhone(e.target.value)} required inputMode="tel" placeholder="(82) 99999-9999" /></label>
        <button className="primary" disabled={sending || !queue.open}>{sending ? 'ENTRANDO...' : 'ENTRAR NA FILA'} <Icon name="arrow" /></button>
        {feedback && <p className="feedback">{feedback}</p>}
        <small>Seu telefone não aparece publicamente. Você recebe um código individual para acompanhar ou cancelar.</small>
      </form>
    </div>
  </div>
}

function App() {
  const slug = window.location.pathname.split('/').filter(Boolean)[0] || fallbackTenant.slug
  const [shop, setShop] = useState({ ...fallbackTenant, slug })
  const [queue, setQueue] = useState(demoQueue)
  const [showQueue, setShowQueue] = useState(window.location.hash === '#fila')
  const [connected, setConnected] = useState(false)

  const queueLabel = useMemo(() => queue.open ? `${queue.people.length} na fila · ~${queue.averageWaitMinutes} min` : 'Fila fechada', [queue])

  async function refreshQueue() {
    try { setQueue(await api.getQueue(slug)) } catch { /* preview continues with demo data */ }
  }

  useEffect(() => {
    api.getShop(slug).then(remote => setShop(current => ({ ...current, ...remote }))).catch(() => {})
    refreshQueue()
    const websocketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/^http/, 'ws') + '/ws'
    const client = new Client({
      brokerURL: websocketUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/topic/barbershops/${slug}/queue`, message => setQueue(JSON.parse(message.body)))
      },
      onWebSocketClose: () => setConnected(false)
    })
    client.activate()
    return () => client.deactivate()
  }, [slug])

  function openQueue() {
    setShowQueue(true)
    history.replaceState(null, '', `/${slug}#fila`)
  }
  function closeQueue() {
    setShowQueue(false)
    history.replaceState(null, '', `/${slug}`)
  }

  return <>
    <header>
      <a className="brand" href={`/${slug}`}><span>DB</span><strong>{shop.name}</strong></a>
      <nav><a href="#servicos">Serviços</a><a href="#local">Local</a><button onClick={openQueue}>VER FILA</button></nav>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{shop.eyebrow}</p>
          <h1>{shop.headline}</h1>
          <p className="lead">{shop.description}</p>
          <div className="hero-actions"><button className="primary" onClick={openQueue}>VER FILA AGORA <Icon name="arrow" /></button><a className="text-link" href="#servicos">Conhecer serviços</a></div>
          <div className="live-pill"><i className={queue.open ? '' : 'off'} /> <span>{queue.open ? 'ABERTO AGORA' : 'FECHADO'}</span><b>{queueLabel}</b></div>
        </div>
        <div className="hero-photo" role="img" aria-label="Barbeiro realizando um corte"><div className="photo-card"><span>ATENDIMENTO HOJE</span><strong>11h — 19h</strong><small>fila por ordem de chegada</small></div></div>
      </section>

      <section className="notice"><div><span>AVISO DE HOJE</span><p>{shop.notice}</p></div><button onClick={openQueue}>ACOMPANHAR FILA <Icon name="arrow" /></button></section>

      <section className="section services" id="servicos">
        <div className="section-heading"><div><p className="kicker">SEM ENROLAÇÃO</p><h2>Serviço bem feito.<br/>Preço bem explicado.</h2></div><p>Escolha o serviço, acompanhe a fila e venha quando estiver chegando a sua vez.</p></div>
        <div className="service-grid">{shop.services.map((service, index) => <article key={service.name}><span>0{index + 1}</span><Icon name="scissors"/><h3>{service.name}</h3><p>{service.text}</p><footer><strong>{service.price}</strong><small><Icon name="clock"/>{service.duration}</small></footer></article>)}</div>
      </section>

      <section className="experience">
        <div className="experience-photo" />
        <div className="experience-copy"><p className="kicker">FILA INTELIGENTE</p><h2>Espere menos.<br/>Viva mais.</h2><p>A fila atualiza na hora para você saber quantas pessoas estão na frente. O barbeiro chama o próximo; você acompanha tudo pelo celular.</p><ul><li><span>01</span>Entre na fila pelo celular</li><li><span>02</span>Acompanhe sua posição</li><li><span>03</span>Chegue perto da sua vez</li></ul><button className="primary light" onClick={openQueue}>ENTRAR NA FILA <Icon name="arrow"/></button></div>
      </section>

      <section className="section location" id="local">
        <div><p className="kicker">ONDE ESTAMOS</p><h2>Perto de você.<br/>Pronto pra atender.</h2><p><Icon name="pin"/>{shop.address}</p><p><Icon name="clock"/>Segunda a sábado · 11h às 19h</p></div>
        <div className="contact-card"><span>Fale direto com a barbearia</span><a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noreferrer">CHAMAR NO WHATSAPP <Icon name="arrow"/></a><small>{shop.instagram}</small></div>
      </section>
    </main>

    <footer className="site-footer"><a className="brand" href={`/${slug}`}><span>DB</span><strong>{shop.name}</strong></a><p>© {new Date().getFullYear()} · Feito para valorizar a barbearia de bairro.</p><small>{connected ? 'Fila conectada em tempo real' : 'Visualização demonstrativa'}</small></footer>
    <div className="mobile-bar"><div><small>{queue.open ? 'FILA ABERTA' : 'FILA FECHADA'}</small><strong>{queueLabel}</strong></div><button onClick={openQueue}>VER FILA</button></div>
    {showQueue && <QueuePanel shop={shop} queue={queue} onClose={closeQueue} onJoined={refreshQueue}/>} 
  </>
}

export default App
