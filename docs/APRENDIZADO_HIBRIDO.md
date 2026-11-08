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
- `src/learning.mjs`: lições verificadas; busca exata e aproximada, rejeita conteúdo sensível, mantém no máximo 128 lições aprovadas por instalação/navegador (chave local antiga preservada). Respostas de acompanhamento como “Pode repetir?” só recuperam a lição se ela tiver sido efetivamente usada na resposta anterior.
- `src/semantic-memory.mjs`: extrai relações explícitas de lições aprovadas; responde por assunto e faz associação reversa **apenas quando há uma única evidência compatível**. Não inventa conhecimento nem faz inferências gerais irrestritas.
- `src/teaching-intents.mjs`: até 160 exemplos de significado aprovados, separados do armazenamento de fatos.

## Cérebro comportamental e autonomia
`src/behavior.mjs` mantém 512 células LIF, 16.384 sinapses simuladas e seleção limitada de ações. A plasticidade agora usa trilhas de atividade no último pulso e preserva no máximo 512 sinapses ajustadas (não 16.384 sinapses treinadas). Pode sugerir ou reagir ao contexto público com restrições de frequência, visibilidade e atividade do usuário.
A interface permite elogios/broncas por botões. Mensagens classificadas como feedback também ajustam uma **iniciativa recente** (janela de 120 segundos). Isso não autoriza editar arquivos, publicar, enviar mensagens ou controlar terceiros.

## Privacidade e limites
- Conhecimentos e exemplos ensinados ficam no armazenamento local do navegador, não são publicados no GitHub nem compartilhados automaticamente entre usuários.
- A consulta ao Gemini é opcional e somente ocorre quando o mecanismo local não possui resposta suficiente. O contexto autorizado pode ser enviado ao servidor configurado.
- Uma resposta do Gemini não vira conhecimento automaticamente.
- O sistema **não** é um LLM independente e não garante equivalência semântica para qualquer paráfrase. O classificador de linguagem continua com 96 entradas, 24 unidades ocultas e 12 saídas; seus vetores de referência pré-definidos são calculados uma vez por sessão e o armazenamento de frases corrigidas aumentou de 24 para 64 protótipos numéricos. Sem conexão autorizada, continua com o modo local.

## Verificação
```bash
npm test
npm run build
node --check dist/alquimago.js
```

A integração do site hospedeiro deve executar esses comandos e carregar o artefato recém-gerado. Alterar `src/` não modifica sozinho um site já publicado; o deploy do hospedeiro é independente.

O repositório inclui `.github/workflows/verify.yml` para executar esses checks em commits novos e pull requests. Não declare a versão pronta para produção sem conferir o resultado do workflow.

## Upgrade cognitivo 2.0 (bundle 0.11.0)

- A capacidade adicional é **limitada e local**, não treinamento de um modelo de linguagem de grande porte. Mais dados aprovados reduzem esquecimento por sobrescrita sem aumentar a frequência de iniciativas autônomas.
- A busca do classificador reutiliza vetores de treino de referência na sessão, evitando recalcular centenas de vetores a cada frase. Os pesos continuam operando integralmente no navegador.
- O condicionamento do córtex usa sinapses que receberam impulsos no último pulso; a rede completa permanece com 16.384 conexões simuladas, mas somente até 512 alterações são persistidas, como ajustes esparsos.
- O painel exibe o total de sinapses simuladas e quantas delas foram realmente adaptadas; esses números não significam compreensão humana nem capacidade geral de raciocínio.
- Memória aprovada: até 128 lições, 160 exemplos de linguagem e 64 protótipos vetoriais; preserva as chaves e registros da versão anterior.
- Nenhuma resposta do Gemini vira lição sem revisão humana; não existe publicação nem escrita em arquivos por decisão autônoma do córtex.
- Limites deliberados: armazenamento do navegador sujeito a cota e limpeza, contexto do diálogo restrito, apenas 12 classes neurais legadas e no máximo 16 ações motoras discretas. Aumento de neurônios sem dados de treinamento adicionais não garante inteligência melhor.
