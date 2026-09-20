export const tenant = {
  slug: 'denis',
  name: 'Denis Barber',
  eyebrow: 'Barbearia de bairro. Experiência de primeira.',
  headline: 'Seu corte, no seu tempo.',
  description: 'Veja a fila antes de sair de casa e chegue perto da sua vez. Sem lista perdida no WhatsApp e sem duas horas esperando.',
  notice: 'Hoje atendemos das 11h às 19h. Última entrada na fila às 18h20.',
  whatsapp: '5500000000000',
  instagram: '@denisbarber',
  address: 'Rua da Barbearia, 100 — Centro',
  hours: 'Segunda a sábado · 11h às 19h',
  services: [
    { name: 'Corte', price: 'R$ 25', duration: '30 min', text: 'Clássico, social, degradê ou do seu jeito.' },
    { name: 'Barba', price: 'R$ 20', duration: '25 min', text: 'Contorno, acabamento e cuidado completo.' },
    { name: 'Corte + barba', price: 'R$ 40', duration: '50 min', text: 'O combo completo para sair renovado.' }
  ],
  portfolio: [
    { id: 1, title: 'Degradê com desenho', category: 'Degradê', image: '/imagens/denis.png', position: 'center 72%' },
    { id: 2, title: 'Acabamento completo', category: 'Corte + barba', image: '/imagens/destaque.jpg', position: 'center' },
    { id: 3, title: 'Visual renovado', category: 'Social', image: '/imagens/teste.jpg', position: 'center' }
  ],
  reviews: [
    { id: 1, name: 'Avaliação demonstrativa', text: 'Atendimento organizado, corte bem feito e sem perder tempo esperando.' },
    { id: 2, name: 'Avaliação demonstrativa', text: 'Consigo conferir a fila antes de sair de casa. Ficou muito mais prático.' }
  ]
}
