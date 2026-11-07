# Alquimago v0.9 — Assistente contextual e IA opcional

## Duas camadas, sem confundir capacidades

**Contexto local (funciona sem backend):**
- O familiar lê somente um JSON público indicado em \`knowledge.file\` e mantém o assunto da obra citada na conversa atual.
- Responde sobre obras cadastradas, ano, categoria, ferramentas e como apresentá-las. Se não há dado, informa que não sabe.
- Matemática e respostas sim/não continuam determinísticas e não dependem de serviços externos.
- Reações e dicas por hover permanecem baseadas em metadados públicos e, quando possível, estatísticas simples da capa.
- O idioma de saída padrão é PT-BR.

**IA generativa (opcional, requer um serviço ativado):**
- O familiar pode conectar-se ao endpoint HTTPS **\`/api/assistant\`** por meio do \`src/llm.mjs\`.
- O recurso **não é habilitado por instalar apenas o script**. Exige um backend seguro, modelo disponível e autenticação do proprietário.
- Somente após marcar **Usar IA generativa** são enviadas perguntas ao servidor configurado. Os dados enviados são: pergunta, até oito mensagens recentes e metadados mínimos de um projeto selecionado. Sem tokens e sem upload de arquivos.
- Se o servidor estiver indisponível, o familiar explica a falha e usa o mecanismo local. O usuário não deve inserir senhas, dados sigilosos ou textos de terceiros.
- A versão de referência do backend está em \`auth-worker/src/index.js\` do repositório do Studio. Ela depende da autorização GitHub App, Cloudflare Workers AI e dos limites de uso definidos no Worker. **O serviço ainda requer configuração pelo proprietário; não foi implantado automaticamente.**
- A integração pode gerar consumo ou cobranças do provedor de IA. Configure limites de gastos e de requisições antes de habilitar.

## Configuração em qualquer site

Coloque o script do widget e um JSON de configuração publicado no seu próprio domínio. Exemplo de estrutura:

\`\`\`json
{
  "identity":{"name":"Meu Familiar"},
  "knowledge":{"file":"./alquimago/knowledge.json"},
  "llm":{"enabled":false,"endpoint":"","consentRequired":true}
}
\`\`\`

O JSON de conhecimento é estritamente um conjunto de obras **publicadas**, limitado a 150 registros:

\`\`\`json
{
  "schema":1,
  "projects":[
    {"id":"obra-01","title":"Personagem","category":"Character","year":"2026",
     "tools":["Blender","ZBrush"],"description":"Obra autoral","featured":true}
  ]
}
\`\`\`

No Local Studio o arquivo \`public/alquimago/knowledge.json\` é criado/atualizado automaticamente junto com \`src/data/published-portfolio.json\` na mesma ação autenticada de **Publicar**. O arquivo não inclui mensagens, histórico do navegador, rascunhos, tokens ou campos privados. Em outras instalações, o próprio desenvolvedor define como gerar esse JSON.

Para ativar a IA generativa no Studio **após** instalar o Worker e conectar a conta, defina no \`config.json\`:

\`\`\`json
{
  "llm":{
    "enabled":true,
    "endpoint":"https://seu-dominio-de-autenticacao/api/assistant",
    "consentRequired":true
  }
}
\`\`\`

O caminho de IA nunca é usado para executar comandos do GitHub. O atalho “vai comprar pão” continua restrito a abrir uma revisão autenticada da publicação, sem autorização automática.

## Conhecimento e privacidade

O classificador neural de frases **não** é um modelo generativo. O módulo de conhecimento consulta fatos concretos; o LLM opcional compõe respostas abertas. A separação impede que uma regra mal treinada invente uma ação perigosa. Cada camada tem testes e um caminho de falha claro.

O pacote compilado inclui pesos pré-treinados para evitar repetir milhares de ciclos de treinamento ao abrir o site. Novas correções de classificação continuam disponíveis em **Conversar → Ensinar a reconhecer uma frase**. Esse botão ensina categorias, **não adiciona conhecimentos factuais nem altera automaticamente o modelo hospedado**.

## Testes de aceitação

1. Escreva “quais projetos você conhece?”: deve listar obras realmente publicadas.
2. Pergunte “quais ferramentas foram usadas em OBRA?”: deve citar ferramentas reais ou indicar que faltam dados.
3. Faça uma pergunta de acompanhamento: “e o que acha dela?”: deve manter a obra atual.
4. “1+1” retorna 2; “ss” e “nn” funcionam somente quando há uma pergunta pendente.
5. A configuração de IA desativada não faz chamadas a modelos.
6. Ao ativar uma IA remota, a interface pede consentimento, e o backend exige uma sessão autenticada.
7. Publicar atualiza a base pública; recarregar sem publicar descarta o rascunho de XP e aprendizado do Studio.
8. O workflow deve falhar se a distribuição instalada tiver versão/hash incorretos.
