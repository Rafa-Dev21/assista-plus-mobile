
const API_URL = 'https://assista-plus.onrender.com';

export async function apiGet(endpoint) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar a API: ${resposta.status}`);
  }

  return resposta.json();
}

export async function apiPost(endpoint, dados) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao cadastrar: ${resposta.status}`);
  }

  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}
