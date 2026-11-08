# Auditoria de desenvolvimento — Alquimago v0.11.3

Data: 2026-11-08.

## Problemas encontrados e ações

1. A interface pública desabilitava permanentemente a disponibilidade do modelo ao renderizar. A disponibilidade agora é recalculada a partir da configuração e a ativação em sessão permanece restrita ao Studio.
2. O núcleo possuía falas especiais hardcoded para Frankie, obra exclusiva do portfólio. O mecanismo agora lê mensagens opcionais do `assistant.spotlights` do host.
3. O professor Gemini não recebia imagem no chat. Foi adicionado seletor PNG/JPG/WebP, validação de 8 MB, prévia, redução local e envio somente depois de um segundo clique explícito; resposta em texto aparece no diálogo.
4. O README apresentava a antiga versão 0.7 e skin anterior. Foram atualizados os guias e a página de apresentação para documentar o Orb atual e os limites reais.
5. O bundle era marcado como v0.11.3 no build, mas a API interna ainda declarava v0.11.2. Foi alinhada a versão, evitando rejeição na sincronização do portfólio.

## Limitações técnicas e riscos remanescentes

- O cérebro local é um mecanismo limitado de memória, estados e classificação, **não** um LLM local nem uma IA comparável ao Gemini.
- `imageMetrics` analisa cor, luminância e contraste, **não interpreta** o conteúdo da imagem.
- O feedback visual do Gemini depende de internet, de uma API configurada no servidor, de quotas e de permissão do usuário. O modelo pode errar; um render não comprova topologia ou técnicas ocultas.
- O endpoint Gemini no portfólio é publicamente acessível, sujeito a cota e possível abuso. Verificar autenticação e limitação de taxa caso a carga aumente; checagem de Origin não equivale a controle de acesso.
- Toda pasta em repositório público continua pública, e conteúdo distribuído em navegador também é inspecionável.
- `Alquimago_Demo_Offline.html` preserva a versão histórica 0.1; `dist/index.html` apresenta a versão atual.

## Verificação

Rodar `npm test`, `npm run build` e `node --check dist/alquimago.js` no núcleo. No host, rodar `npm run typecheck`, `npm run test:studio`, `npm run test:assistant`, `npm run build`. Depois conferir versão em `/alquimago/release.json` e testar upload e retorno em navegador real. Aprovação do CI não comprova deploy da Cloudflare.
