import { useMemo, useState } from 'react'

function Icon({ name }) {
  const paths = {
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    play: <path d="m8 5 11 7-11 7Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    pause: <><path d="M9 5v14M15 5v14"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    photo: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@denisbarber.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  function submit(event) {
    event.preventDefault()
    if (password !== '1234') return setError('Código demonstrativo incorreto.')
    sessionStorage.setItem('barber-admin-demo', 'true'); onLogin()
  }
  return <main className="admin-login"><section><span className="admin-logo">DB</span><p className="eyebrow">ÁREA DO BARBEIRO</p><h1>Sua fila.</h1><p>Acesso demonstrativo.</p><form onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} required/></label><label>Código<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Digite 1234" required/></label><button>ENTRAR</button>{error && <small className="admin-error">{error}</small>}</form><small className="demo-access">Código: <strong>1234</strong></small></section></main>
}

export default function AdminPage({ shop, setShop, queue, setQueue, navigate }) {
  const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('barber-admin-demo') === 'true')
  const [walkInName, setWalkInName] = useState('')
  const [notice, setNotice] = useState(shop.notice)
  const [hours, setHours] = useState(shop.hours)
  const [completed, setCompleted] = useState(Number(localStorage.getItem('barber-completed-demo') || 0))
  const [message, setMessage] = useState('')
  const [view, setView] = useState('atendimento')
  const active = useMemo(() => queue.people.find(person => ['CALLED', 'IN_SERVICE'].includes(person.status)), [queue.people])
  const nextWaiting = useMemo(() => queue.people.find(person => person.status === 'WAITING'), [queue.people])

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)}/>

  function updatePerson(id, status) {
    setQueue(current => ({ ...current, people: current.people.map(person => person.id === id ? { ...person, status } : person) }))
  }
  function removePerson(id, wasCompleted = false) {
    setQueue(current => ({ ...current, people: current.people.filter(person => person.id !== id).map((person, index) => ({ ...person, position: index + 1 })) }))
    if (wasCompleted) {
      const total = completed + 1; setCompleted(total); localStorage.setItem('barber-completed-demo', String(total))
    }
  }
  function addWalkIn(event) {
    event.preventDefault(); if (!walkInName.trim()) return
    setQueue(current => ({ ...current, people: [...current.people, { id: Date.now(), displayName: walkInName.trim(), position: current.people.length + 1, status: 'WAITING' }] }))
    setWalkInName(''); setMessage('Cliente presencial adicionado à fila.')
  }
  function saveSettings(event) {
    event.preventDefault(); setShop(current => ({ ...current, notice, hours })); setMessage('Aviso e horário atualizados nesta demonstração.')
  }
  function addPhoto(event) {
    const file = event.target.files?.[0]; if (!file) return
    const image = URL.createObjectURL(file)
    setShop(current => ({ ...current, portfolio: [...current.portfolio, { id: Date.now(), title: 'Novo trabalho', category: 'Portfólio', image, position: 'center' }] }))
    setMessage('Foto adicionada ao protótipo. No sistema real ela será salva no servidor.')
  }
  function logout() { sessionStorage.removeItem('barber-admin-demo'); setAuthenticated(false) }

  return <main className="admin-page">
    <section className="admin-welcome"><div><p className="eyebrow">PAINEL DO BARBEIRO</p><h1>Boa, Denis.</h1><p>{queue.people.length} cliente{queue.people.length === 1 ? '' : 's'} na fila.</p></div><button className="admin-logout" onClick={logout}><Icon name="logout"/> SAIR</button></section>

    <nav className="admin-tabs"><button className={view === 'atendimento' ? 'active' : ''} onClick={() => setView('atendimento')}>ATENDIMENTO</button><button className={view === 'ajustes' ? 'active' : ''} onClick={() => setView('ajustes')}>AJUSTES</button></nav>

    {view === 'atendimento' && <>
    <section className="admin-status-card"><div><i className={queue.open ? 'open' : ''}/><span><small>STATUS DA FILA</small><strong>{!queue.open ? 'Fechada' : queue.paused ? 'Pausada' : 'Aberta e recebendo clientes'}</strong></span></div><div className="admin-status-actions"><button className={queue.open && !queue.paused ? 'selected' : ''} onClick={() => setQueue(current => ({ ...current, open: true, paused: false }))}>ABRIR</button><button className={queue.paused ? 'selected' : ''} onClick={() => setQueue(current => ({ ...current, open: true, paused: true }))}><Icon name="pause"/> PAUSAR</button><button className={!queue.open ? 'selected danger' : ''} onClick={() => setQueue(current => ({ ...current, open: false, paused: false }))}>FECHAR</button></div></section>

    <section className="admin-metrics"><article><Icon name="users"/><div><strong>{queue.people.length}</strong><span>na fila agora</span></div></article><article><Icon name="clock"/><div><strong>~{queue.averageWaitMinutes}</strong><span>min de espera</span></div></article><article><Icon name="check"/><div><strong>{completed}</strong><span>finalizados hoje</span></div></article></section>

    {message && <button className="admin-message" onClick={() => setMessage('')}>{message}<span>×</span></button>}

    <section className="admin-grid">
      <article className="service-control"><div className="admin-card-heading"><div><small>ATENDIMENTO ATUAL</small><h2>{active ? active.displayName : 'Nenhum cliente chamado'}</h2></div>{active && <span className={`service-tag ${active.status.toLowerCase()}`}>{active.status === 'CALLED' ? 'CHAMADO' : 'NA CADEIRA'}</span>}</div>
        {!active && nextWaiting && <p>Próximo da fila: <strong>{nextWaiting.displayName}</strong></p>}{!active && !nextWaiting && <p>A fila está vazia.</p>}
        <div className="service-buttons">{!active && <button className="main-control" disabled={!nextWaiting} onClick={() => updatePerson(nextWaiting?.id, 'CALLED')}><Icon name="users"/> CHAMAR PRÓXIMO</button>}{active?.status === 'CALLED' && <button className="main-control" onClick={() => updatePerson(active.id, 'IN_SERVICE')}><Icon name="play"/> INICIAR CORTE</button>}{active?.status === 'IN_SERVICE' && <button className="main-control success" onClick={() => removePerson(active.id, true)}><Icon name="check"/> FINALIZAR</button>}{active && <button className="secondary-control" onClick={() => removePerson(active.id)}>NÃO COMPARECEU</button>}</div>
      </article>

      <article className="admin-queue-list"><div className="admin-card-heading"><div><small>ORDEM DE CHEGADA</small><h2>Fila de hoje</h2></div><span>{queue.people.length}</span></div><ol>{queue.people.map(person => <li key={person.id}><span>{person.position}</span><div><strong>{person.displayName}</strong><small>{person.status === 'WAITING' ? 'Aguardando' : person.status === 'CALLED' ? 'Chamado' : 'Em atendimento'}</small></div><button onClick={() => removePerson(person.id)} aria-label={`Remover ${person.displayName}`}>×</button></li>)}</ol><form className="walk-in-form" onSubmit={addWalkIn}><input value={walkInName} onChange={event => setWalkInName(event.target.value)} placeholder="Nome do cliente presencial"/><button>+ ADICIONAR</button></form></article>

    </section>
    </>}

    {view === 'ajustes' && <section className="admin-grid admin-settings-grid">
      <article className="admin-settings"><div className="admin-card-heading"><div><small>PÁGINA DO CLIENTE</small><h2>Aviso e horário</h2></div></div><form onSubmit={saveSettings}><label>Aviso<textarea value={notice} onChange={event => setNotice(event.target.value)} maxLength="240"/></label><label>Horário<input value={hours} onChange={event => setHours(event.target.value)}/></label><button>SALVAR</button></form></article>
      <article className="admin-gallery"><div className="admin-card-heading"><div><small>PORTFÓLIO</small><h2>Fotos dos cortes</h2></div><span>{shop.portfolio.length}</span></div><div className="admin-thumbs">{shop.portfolio.slice(-4).map(photo => <img key={photo.id} src={photo.image} alt=""/>)}<label className="add-photo"><Icon name="photo"/><span>ADICIONAR FOTO</span><input type="file" accept="image/*" onChange={addPhoto}/></label></div></article>
    </section>}

    <button className="preview-public" onClick={() => navigate('')}>VER PÁGINA DO CLIENTE</button>
  </main>
}
