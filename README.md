# ✦ Alquimago — Familiar Arcano Digital

Mascote visual independente, configurável por JSON, para **React, Vite, HTML e Windows (Tauri 2)**.

**Versão:** 0.4.0 — protótipo funcional. Não é uma IA autônoma, nem controla contas ou aplicativos de terceiros. Código e ilustrações originais sob licença MIT.

## Recursos

- Familiar alquimista redesenhado com frasco brilhante, símbolos arcanos, humor visual e gestos de carinho (deslize curto sobre o personagem).
- XP com regras de anti-repetição: carinho/descanso não concedem XP, habilidades possuem intervalo, exploração de cada rota rende no máximo uma vez ao dia e publicações confirmadas podem conceder XP uma vez por revisão.
- Personalidade, emoções simbólicas, energia, foco, curiosidade e níveis.
- Configuração por arquivo `alquimago.config.json`, com nome, paleta, mensagens, recursos e regras de projeto.
- Memória local separada por origem e namespace, com migração da v0.1, exportação e restauração de backup.
- Shadow DOM: não modifica estilos nem componentes do site anfitrião.
- Observação contextual do DOM público e da rota atual, com sugestões acessíveis de conteúdo, imagens e navegação, sem ler valores de inputs, formulários ou conversas.
- Navegação por links da mesma origem, escolhidos pelo usuário.
- Ponte opcional de eventos com o editor React: seção ativa e contagem geral de projetos/páginas.
- Leitura **somente** de arquivos públicos, de texto, explicitamente permitidos no JSON, em resposta ao comando do usuário.
- No desktop, seleção manual de uma pasta para leitura restrita a textos (dependente do suporte da WebView do sistema).
- Prepara sugestões e contexto para ChatGPT/Gemini. O usuário inicia a conversa e cola o texto; não há automação de login, leitura de chats ou contorno de limites.

## Instalação em um site

Copie `dist/alquimago.js` para a pasta de recursos públicos do seu projeto e coloque `alquimago.config.json` onde ele seja servido por HTTP.

Insira **uma vez** antes de `</body>`:

```html
<script defer data-config="./alquimago.config.json" src="./alquimago.js"></script>
```

Em Vite/React, por exemplo, coloque os arquivos na pasta `public/`. Não é necessário reinstalar quando o site publica atualizações normais. A configuração pode definir um namespace específico para cada site.

Para carregar a distribuição pela hospedagem do projeto Alquimago, use o URL de hospedagem configurado pela sua organização. Prefira arquivos locais ou versões fixas quando precisar evitar mudanças inesperadas de um script remoto.

**Configuração:** use `alquimago.config.json` como modelo. Campos inesperados são ignorados. Os textos da configuração entram na interface por `textContent` e não como HTML. O arquivo deve estar hospedado na **mesma origem** do site.

## Persistência e GitHub

A memória pessoal de cada visitante é mantida em `localStorage`, isolada pelo domínio e por `memory.namespace`. Ela permanece quando o site recebe um novo deploy **na mesma origem**. Limpar dados do navegador, mudar de domínio ou navegar em outro dispositivo não sincroniza a memória automaticamente; há botões para exportar e restaurar um backup.

Se `memory.remoteSnapshot` indicar um JSON público de memória na mesma origem, uma instalação sem progresso local poderá recuperar esse estado inicial. **O progresso já salvo no dispositivo nunca é substituído pela cópia remota.** A cópia do repositório é uma referência compartilhada do projeto, não um banco de dados individual de visitantes.

Um site estático **não** consegue gravar diretamente em um repositório GitHub sem autenticação. Para versionar dados do mascote, o editor do site precisa adicionar um arquivo JSON ao **fluxo de publicação autenticado que já utiliza**. Não publique dados pessoais dos visitantes nem tokens.

A integração demonstrativa com um editor React/Local Studio usa `public/alquimago/project-context.json` e um resumo numérico público opcional de XP em `public/alquimago/project-memory.json`, no **mesmo commit** de publicação do conteúdo. Isso é um exemplo; não é comportamento automático em todos os sites.

## Aplicativo Windows

```bash
npm install
npm test
npm run build
npm run desktop:build
```

A compilação requer Rust e ferramentas de build compatíveis com Tauri 2 no Windows. Também existe workflow de GitHub Actions para gerar um instalador, se a compilação for bem-sucedida. **A build Windows ainda não foi validada em dispositivo Windows.**

O mascote no desktop **não** lê automaticamente todos os arquivos do PC: o usuário deve selecionar uma pasta, e a leitura é limitada a arquivos de texto. Esse limite é deliberado.

## Desenvolver

```bash
npm test
npm run build
```

- `src/brain.mjs`: estados e evolução de XP, sem modelo de linguagem.
- `src/config.mjs`: validação de configurações públicas.
- `src/storage.mjs`: migração e exportação de memória.
- `src/project.mjs`: leitura permitida de arquivos públicos.
- `src/widget.js`: componente visual e interações.
- `scripts/build.mjs`: distribuição sem dependências de runtime.
- `react/Alquimago.tsx`: integração opcional.
- `src-tauri/`: estrutura para desktop.

## Privacidade e origem

Nunca inclua segredos, código privado ou credenciais nos arquivos listados em `project.files`. Tudo o que for servido como público no GitHub Pages pode ser visto por visitantes. O acesso a arquivos do PC exige escolha explícita. Não há envio automático de dados para provedores de IA.

O conceito foi inspirado em mascotes adaptativos de desktop, incluindo [Pestinha](https://github.com/mille-okws/pestinha). O Alquimago foi reimplementado de forma independente; não redistribui código ou artes do Pestinha. Consulte `docs/ORIGEM_E_LICENCAS.md`.

## Integrar observação de um editor React

O mascote funciona sozinho. Para melhorar as sugestões, um editor pode enviar **apenas metadados públicos e seguros**:

```js
const announce = () => window.dispatchEvent(new CustomEvent('alquimago:studio-context', {
  detail: { editing: true, section: 'gallery', projects: 6, pages: 2 }
}));
window.addEventListener('alquimago:request-context', announce);
announce();
```

Retire o listener ao desmontar o editor. Não envie rascunhos, tokens, senhas, valores digitados ou mensagens de usuários. Quando uma publicação autenticada terminar, o aplicativo pode notificar um marco opcional:

```js
window.dispatchEvent(new CustomEvent('alquimago:activity', {
  detail: { type: 'published', revision: 'id-publico-da-revisao' }
}));
```

Esses eventos são informativos e podem ser emitidos por qualquer código do mesmo site: a recompensa em XP é **cosmética**, não um comprovante de publicação. A integração de produção deve despachar esse evento apenas após a confirmação do backend/GitHub.

O Alquimago não visualiza outras abas do navegador nem controla ChatGPT/Gemini. Ele usa um relatório de contexto e uma abertura explícita de sites externos; para automação real entre serviços são necessários conectores e permissões oficiais.


## Gestos e conversa — v0.4

- **Carinho verdadeiro:** movimente o cursor horizontalmente várias vezes sobre a cabeça/chapéu, **sem clicar**. O personagem reage com corações e afinidade. No toque, faça um deslize curto; um arraste mais longo move o familiar.
- **Clique simples:** reage e abre a aba **Conversar**. As frases são respondidas pelo motor local determinístico; ele **não é** um modelo de linguagem generativo.
- **Botão direito:** abre o grimório de ações. **Roda do mouse:** gira o personagem brevemente.
- **Conversar:** digite perguntas como `oi`, `quanto XP tenho?`, `como faço carinho?`, `tem sugestões pro site?` ou `abre a galeria`. Comandos de navegação só procuram links já disponíveis **na mesma origem**.
- **Persistência:** diálogo e XP ficam no armazenamento do navegador por origem e namespace, sobrevivendo à atualização da versão do site. Mensagens reconhecidas como possíveis segredos não são mantidas no histórico.
- **Sem XP infinito:** carinho não rende XP; brincar, criar poções e explorar têm limites e intervalos.
- **Versão visível:** ao abrir o grimório, o cabeçalho mostra `v0.4`. Se não aparecer, a página ainda carrega a distribuição antiga.

### React / atualização e cache

Coloque a distribuição atualizada em `public/alquimago/alquimago.js` e mude o identificador de versão da URL quando atualizar:

```html
<script defer data-config="/alquimago/config.json?v=0.4.0" src="/alquimago/alquimago.js?v=0.4.0"></script>
```

Em apps hospedados em subpastas, ajuste as URLs ao caminho base do deploy. Se o mascote é exibido somente quando um editor está desbloqueado, recarregar a página pode fechar esse editor; reabra-o para verificar a versão. A publicação do arquivo no GitHub não prova que o GitHub Pages compilou e entregou a atualização. Confira as execuções de Actions e valide no navegador.

Os gestos foram reimplementados independentemente, inspirados pela documentação do [Pestinha original](https://github.com/mille-okws/pestinha); nenhum asset ou trecho do seu código foi incorporado.
