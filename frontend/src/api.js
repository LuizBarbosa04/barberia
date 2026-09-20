const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  })
  if (!response.ok) throw new Error((await response.text()) || 'Não foi possível concluir a operação.')
  return response.status === 204 ? null : response.json()
}

export const api = {
  getShop: slug => request(`/api/public/barbershops/${slug}`),
  getQueue: slug => request(`/api/public/barbershops/${slug}/queue`),
  joinQueue: (slug, payload) => request(`/api/public/barbershops/${slug}/queue`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
