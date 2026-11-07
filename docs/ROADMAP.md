# Roadmap — Alquimago

## 0.1 — entregue como protótipo

- [x] Mascote React-compatível em um script isolado, sem pacote npm obrigatório no site.
- [x] Personalidade visual, animações e parâmetros de comportamento persistidos no navegador.
- [x] Auditoria DOM local, rotas detectadas no mesmo domínio, prompt de continuidade manual.
- [x] Projeto inicial de desktop Tauri 2, com workflow para gerar instalador no Windows.
- [x] Testes unitários do núcleo.
- [ ] Validar o instalador em máquina Windows real.
- [ ] Validar layout em telas móveis e navegadores variados.

## 0.2 — comportamento e ergonomia

- [ ] Migração do armazenamento para IndexedDB opcional (múltiplos projetos).
- [ ] Expressões, efeitos e movimentos mais elaborados; testes de acessibilidade.
- [ ] Modo silencioso, desligar globalmente, limitar animações e posição por rota.
- [ ] Verificar se o widget prejudica leitores de tela, Core Web Vitals ou a navegação.

## 0.3 — Studio Bridge (somente aplicativo local autorizado)

- [ ] Abrir uma pasta de projeto selecionada pelo usuário.
- [ ] Ler arquivos de projeto com limites de diretório; negar acesso a `.env`, tokens, senhas e dados pessoais.
- [ ] Prévia de diferenças, validação, backup e aprovação antes de cada gravação.
- [ ] Operações Git em branch separada e pull request com aprovação.
- [ ] Nenhum servidor local exposto externamente; autenticação local e CORS estrito quando necessário.

## 0.4 — assistentes e tarefas

- [ ] Conectores oficiais / processos locais permitidos para modelos de linguagem.
- [ ] Histórico de tarefas independente do provedor, checkpoints e retomada robusta.
- [ ] Fallback manual ChatGPT↔Gemini como opção; automação só por meios autorizados.
- [ ] Não tentar contornar limites, login, CAPTCHA ou requisitos das plataformas.

## Definição de pronto

Somente marcar como concluído quando código, testes, documentação e execução real no ambiente-alvo forem verificados. O mascote não deverá bloquear a compilação nem a publicação do portfólio.
