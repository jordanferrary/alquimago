# Integração e privacidade

## Núcleo público: Alquimago

O repositório `jordanferrary/alquimago` contém apenas os componentes reutilizáveis: a skin Orb 2D, cérebro local simbólico, interface, aprendizado aprovado, análise de pixels, preparação de imagens, transporte opcional para IA, testes, modelos de configuração, documentação e demonstrações. Ele não deve conter textos ou obras específicas de um portfólio, credenciais nem dados particulares do proprietário.

## Integração específica: portfolio_jordan

O repositório `jordanferrary/portfolio_jordan` contém a interface visual do site, o Local Studio, seus assets e obras, e os dados públicos da integração:

- `public/alquimago/config.json` — paleta, habilitação do Gemini e `assistant.spotlights` (falas sobre obras).
- `public/alquimago/knowledge.json` e `project-context.json` — resumos públicos dos projetos.
- `public/alquimago/project-memory.json` — snapshot numérico **público**; não publicar lições nem histórico privado.
- `functions/api/assistant.js` — proxy Cloudflare com validação, sem expor a chave secreta `GEMINI_API_KEY`.
- `scripts/sync-alquimago.mjs` — busca, testa e compila o núcleo upstream durante cada build.

As personalizações da obra "Frankie" foram removidas do código do bot e movidas para `assistant.spotlights` do portfólio. Outros sites podem configurar seus próprios destaques.

## Não confundir pastas e privacidade

Ambos os repositórios atuais são públicos. Qualquer arquivo incluído em um commit público ou servido pelo site pode ser inspecionado por terceiros, ainda que fique numa pasta com nome "private". `.gitignore` previne inclusões futuras de arquivos não versionados, mas **não remove conteúdo já publicado**. Segredos devem viver em Secret da Cloudflare ou em outro backend com controle de acesso; lições e dados do usuário podem ficar no armazenamento local do navegador. O PIN do Studio é apenas proteção da interface, não autenticação do servidor.

## Imagens e permissão

A seleção cria uma prévia local; o arquivo é reduzido no navegador. Somente o clique em **Analisar imagem com Gemini**, após habilitação explícita da IA, envia o JPEG compactado ao endpoint do site, que o encaminha ao Google Gemini. Os pixels não são gravados em Git, lições ou backups do Alquimago. A análise semântica **não é offline**; o processamento por IA depende de rede e serviço externo.

A versão visual independente funciona sem Gemini. Um backend diferente deve aplicar validações equivalentes e controles de cota/rate limit.

## Fluxo de publicação

Alquimago `src/` → testes → `scripts/build.mjs` → integração do site usando `scripts/sync-alquimago.mjs`. Um commit no bot não atualiza o site sem novo build e deploy do host. Não alterar manualmente o bundle gerado do portfólio.
