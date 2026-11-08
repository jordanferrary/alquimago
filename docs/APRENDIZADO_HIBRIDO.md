# Arquitetura de aprendizado híbrido — Alquimago

## Objetivo
O Alquimago combina respostas verificáveis locais, memória supervisionada e iniciativas comportamentais. O Gemini é um **professor opcional**, não a identidade do personagem.

## Fluxo de conversa
1. O usuário envia uma mensagem no grimório.
2. O familiar procura uma lição previamente aprovada, com normalização de acentos, abreviações (como `vc`) e tolerância limitada a erros e pequenas reformulações.
3. Se não houver correspondência, procura uma relação factual aprovada na memória semântica.
4. Usa as respostas locais determinísticas para conhecimentos do projeto, comandos autorizados, estado e ações da interface.
5. Se a resposta continuar desconhecida e o acesso ao modelo estiver **habilitado pelo usuário**, consulta o endpoint HTTPS autorizado em modo `mentor`.
6. A explicação do professor aparece como **rascunho**. Só passa a integrar a memória após aprovação humana. A próxima pergunta semelhante pode ser respondida localmente.

O backend de IA precisa estar configurado separadamente. O pedido inclui `mode: mentor` e `task: explain_unknown_question_for_local_familiar`. A resposta preferida é `{lesson: {explanation: string}}`; `{reply: string}` continua compatível. Nunca coloque chaves do Gemini no JavaScript público.

## Ensinar significados
A interface de ensino do grimório permite **selecionar múltiplas intenções** (pergunta, resposta, bronca, elogio, instrução, correção, etc.), escolher tom e informar assunto.
- `src/teaching-intents.mjs`: validação, exemplos revisados, reconhecimento conservador e persistência local isolada por namespace.
- `src/neural.mjs`: classificador clássico de 12 intenções mantido por compatibilidade. Só recebe correção automática quando existe um mapeamento não ambíguo; não deve transformar uma bronca em uma poção por engano.
- O aprendizado da classificação e o aprendizado de fatos são componentes diferentes.

## Memória de fatos
- `src/learning.mjs`: lições verificadas; busca exata e aproximada, rejeita conteúdo sensível, mantém no máximo 64 lições por instalação/navegador.
- `src/semantic-memory.mjs`: extrai relações explícitas de lições aprovadas; responde por assunto e faz associação reversa **apenas quando há uma única evidência compatível**. Não inventa conhecimento nem faz inferências gerais irrestritas.
- `src/teaching-intents.mjs`: até 80 exemplos de significado aprovados, separados do armazenamento de fatos.

## Cérebro comportamental e autonomia
`src/behavior.mjs` mantém 512 células LIF, 16.384 sinapses simuladas e seleção limitada de ações. Pode sugerir ou reagir ao contexto público com restrições de frequência, visibilidade e atividade do usuário.
A interface permite elogios/broncas por botões. Mensagens classificadas como feedback também ajustam uma **iniciativa recente** (janela de 120 segundos). Isso não autoriza editar arquivos, publicar, enviar mensagens ou controlar terceiros.

## Privacidade e limites
- Conhecimentos e exemplos ensinados ficam no armazenamento local do navegador, não são publicados no GitHub nem compartilhados automaticamente entre usuários.
- A consulta ao Gemini é opcional e somente ocorre quando o mecanismo local não possui resposta suficiente. O contexto autorizado pode ser enviado ao servidor configurado.
- Uma resposta do Gemini não vira conhecimento automaticamente.
- O sistema **não** é um LLM independente e não garante equivalência semântica para qualquer paráfrase. Sem conexão autorizada, continua com o modo local.

## Verificação
```bash
npm test
npm run build
node --check dist/alquimago.js
```

A integração do site hospedeiro deve executar esses comandos e carregar o artefato recém-gerado. Alterar `src/` não modifica sozinho um site já publicado; o deploy do hospedeiro é independente.

O repositório inclui `.github/workflows/verify.yml` para executar esses checks em commits novos e pull requests. Não declare a versão pronta para produção sem conferir o resultado do workflow.
