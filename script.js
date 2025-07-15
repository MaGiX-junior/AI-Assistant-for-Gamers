const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

//AIzaSyAc4jsbvjDw5hWSZ4JUzELh-YDMrba4nss
//3
const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL =  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = `
   ## Especialidade
   Você é um assistente de meta para o jogo ${game}

   ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

   ## Regras
   -Se você não sabe a resposta, responda com 'Não sei' e nao tente inventar uma resposta.
   -Se a pergunta não esta relacionada ao jogo, responda com ' Essa pergunta nao está relacionada ao jogo'. 
   -Considere a data atual ${new Date().toLocaleDateString()}
   -Faça pesquisa atualizadas sobre o patch atual, baseada na data atual para dar uma resposta coerente. 
   -Nunca responda itens que você não tem certeza que está no patch atual

   ## Resposta
   -Economize na resposta, seja direto e responda no máximo 500 caracteres. -Responda em markdown
   -Não precisa fazer saudação ou despedida, apenas responda o que o usuário quer

   ## Exemplo de resposta
   pergunta do usuário: Melhior build g36c da ash
   resposta: a build mais atual é: \n\n **itens:**\n\n coloque os itens aqui.

   ---
   Aqui está a pergunta do usuário: ${question}
  `
  


  
  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}
  }]

  // chamada API
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value
//1
  if(apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos')
    return
  }
  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')
//2
  try {
  const text = await perguntarAI(question, game, apiKey)
  aiResponse.querySelector('.response-content').innerHTML = markdownToHTML (text)
  aiResponse.classList.remove('hidden')

  } 
  catch(error) {
    console.log('Erro: ', error)
  } 
  finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }
  

}
form.addEventListener('submit', enviarFormulario)
