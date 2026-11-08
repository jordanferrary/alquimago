# ✦ Alquimago — Familiar Arcano Digital

Mascote visual independente, configurável por JSON, para **React, Vite, HTML e Windows (Tauri 2)**.

**Versão:** 0.11.5 — familiar com comportamento adaptativo e aprendizado local aprovado. Não é um modelo de linguagem autônomo. O professor Gemini é opcional e depende de um backend do site integrador. Código e ilustrações sob licença MIT.

## Recursos

- Skin padrão Orb 2D: robô esférico expressivo, animações, emoções simbólicas e gestos de carinho (deslize curto sobre o personagem).
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


## Skins 3D e expressões faciais

O site anfitrião pode registrar um adaptador WebGL/Three.js para skins `model3d`; o componente não instala bibliotecas 3D automaticamente. O fluxo de importação pela interface do Local Studio está sendo desenvolvido no repositório `portfolio_jordan`, sem alterar a publicação existente.

Consulte [o guia completo de exportação GLB e Shape Keys](docs/SKINS_3D_SHAPE_KEYS.md). O contrato facial usa `Basis`, `Idle`, `Blink`, `Happy`, `Curious`, `Talk`, `Sleep`, `Pet`, `Surprised`, `Focused` e `Sad`. Os nomes devem sobreviver à exportação para GLB 2.0.

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


## Gestos e conversa — v0.5

- **Carinho verdadeiro:** movimente o cursor horizontalmente várias vezes sobre a cabeça/chapéu, **sem clicar**. O personagem reage com corações e afinidade. No toque, faça um deslize curto; um arraste mais longo move o familiar.
- **Clique simples:** reage e abre a aba **Conversar**. As frases são respondidas pelo motor local determinístico; ele **não é** um modelo de linguagem generativo.
- **Botão direito:** abre o grimório de ações. **Roda do mouse:** gira o personagem brevemente.
- **Conversar:** digite perguntas como `oi`, `quanto XP tenho?`, `como faço carinho?`, `tem sugestões pro site?` ou `abre a galeria`. Comandos de navegação só procuram links já disponíveis **na mesma origem**.
- **Persistência:** diálogo e XP ficam no armazenamento do navegador por origem e namespace, sobrevivendo à atualização da versão do site. Mensagens reconhecidas como possíveis segredos não são mantidas no histórico.
- **Sem XP infinito:** carinho não rende XP; brincar, criar poções e explorar têm limites e intervalos.
- **Versão visível:** ao abrir o grimório, o cabeçalho mostra `v0.5`. Se não aparecer, a página ainda carrega a distribuição antiga.

### React / atualização e cache

Coloque a distribuição atualizada em `public/alquimago/alquimago.js` e mude o identificador de versão da URL quando atualizar:

```html
<script defer data-config="/alquimago/config.json?v=0.7.0" src="/alquimago/alquimago.js?v=0.7.0"></script>
```

Em apps hospedados em subpastas, ajuste as URLs ao caminho base do deploy. Se o mascote é exibido somente quando um editor está desbloqueado, recarregar a página pode fechar esse editor; reabra-o para verificar a versão. A publicação do arquivo no GitHub não prova que o GitHub Pages compilou e entregou a atualização. Confira as execuções de Actions e valide no navegador.

Os gestos foram reimplementados independentemente, inspirados pela documentação do [Pestinha original](https://github.com/mille-okws/pestinha); nenhum asset ou trecho do seu código foi incorporado.

### Reset local seguro (v0.7.0)

No grimório, abra **Cuidado → Reiniciar dados locais** e confirme para zerar
XP, atributos, posição e conversa **somente neste navegador e nesta instalação**.
As configurações do projeto, seus arquivos e o repositório GitHub permanecem intactos.
A memória é sobrescrita por uma base inicial, em vez de apagar a chave, para que
um snapshot público anterior não ressurja automaticamente após o reset.

**Ctrl + F5** e **Ctrl + Shift + R** solicitam novamente arquivos de página/cache;
**não** apagam `localStorage` nem o progresso do familiar. Isso é proposital,
porque atualizações de sites não devem destruir a memória de visitantes.
Para embutir o Alquimago num app Vite, um identificador de build na URL do script
(como `?v=<commit>`) evita servir uma versão JavaScript já obsoleta.

## Alquimago v0.5 — cérebro neural e fluxo de publicação

**Diálogo:** existe agora uma rede neural genuína, pequena e treinável, com **96 neurônios de entrada, 24 neurônios internos e 12 saídas de intenções**. Ela reconhece expressões variadas como `oi`, `OIE`, pedidos sobre XP, carinho, poções e rotas. O sistema de respostas continua local, limitado a conhecimentos definidos e observações públicas do site: **não é um LLM nem uma IA generativa**. Para perguntas complexas permanece o encaminhamento autorizado para ChatGPT/Gemini.

**Ensinar:** após enviar uma mensagem, selecione o significado correto e clique em **Ensinar**. Os pesos são atualizados por gradiente supervisionado no próprio navegador. O texto bruto não é incluído no arquivo numérico exportado ou publicado; mensagens identificadas como segredos não ficam disponíveis para treinamento.

**Layout:** o grimório utiliza um painel opaco com altura limitada à janela e rolagem interna, além de um botão para fechar. Em telas estreitas, ocupa a área segura visível em vez de crescer para fora da viewport. O personagem fica independente do painel.

**Políticas de memória:** em `alquimago.config.json` configure:

```json
{
  "memory": {
    "namespace": "meu-site",
    "mode": "local",
    "remoteSnapshot": ""
  }
}
```

- `mode: "local"` (padrão): XP, conversas e pesos treinados são mantidos no navegador após recarregar, com backup opcional.
- `mode: "publish"`: o estado funciona como **rascunho temporário**. Ao recarregar, volta à última memória pública em `remoteSnapshot`. É indicado para editores que oferecem **publicação explícita**, como o Local Studio.
- Em modo de publicação, o editor anfitrião pode ler `document.querySelector('alquimago-familiar')?.snapshot()` **somente na ação autorizada de publicar** e gravar seu resultado sanitizado no repositório por um fluxo autenticado. O widget não publica arquivos por conta própria. Ele emite `alquimago:request-publish` quando o usuário aciona **Publicar alterações**.
- O snapshot numérico público pode conter XP, humor simbólico e pesos da rede neural, mas **nunca transcrições da conversa**. Como os pesos aprendidos serão públicos se publicados em GitHub Pages, não ensine dados privados e não permita que mensagens contendo segredos sejam utilizadas no treinamento.

**Compatibilidade:** as atualizações de código do widget são independentes de `memory.namespace`. Nunca limpe o armazenamento de outros aplicativos ao atualizar o Alquimago. A versão v0.5 não foi validada visualmente em todos os navegadores/Windows; execute os testes e inspecione o build antes de distribuir amplamente.

## Recursos v0.6 e auditoria do Pestinha

A auditoria de arquitetura está em [docs/AUDITORIA_PESTINHA.md](docs/AUDITORIA_PESTINHA.md). Não há paridade integral com o pet desktop: no navegador, a observação respeita as permissões do site. Entre as novidades estão comentários proativos de obras, amostragem local de luminosidade/cor das capas, ensino neural imediatamente verificável, três abas principais com scrollbar personalizada, idiomas opcionais por arquivo e skins configuráveis. Veja [docs/SKINS_3D.md](docs/SKINS_3D.md) e [locales/README.md](locales/README.md).

A versão publicada no Local Studio continua usando a memória temporária até o usuário clicar em Publicar; apenas pesos numéricos e atributos aprovados seguem para o GitHub. O renderer 3D requer instalação **opt-in** de Three.js no projeto React, não estando ativo por padrão.


## Alquimago v0.7 — autonomia, condicionamento e brinquedo

O mascote agora separa **linguagem** de **comportamento**: o classificador de frases continua funcionando, mas um novo córtex LIF local com **512 neurônios, 16.384 conexões, 32 sensores e 16 motores** avalia estímulos públicos do site e escolhe iniciativas com moderação. A rede comportamental não é uma IA generativa e **não controla o GitHub, outras abas ou aplicações do sistema operacional**.

Novidades principais:
- **Autonomia consentida:** comentários pontuais, pequenas reações e sugestões quando há sinais úteis. Limites de frequência e máximo diário, pausa quando alguém está digitando, editando ou com o painel aberto e suporte a movimento reduzido.
- **Feedback que modifica decisões:** na aba **Interagir → Cérebro e autonomia**, marque **Gostei** ou **Menos disso** após uma iniciativa. O córtex aprende contexto, reforço e episódios de ação (sem texto ou dados pessoais).
- **Orbe arcano:** brinquedo opcional com física, gravidade, colisões, arraste e arremesso, confinado a uma pequena área do personagem.
- **Memória preservada:** modo `local` salva aprendizado no navegador. Modo `publish` envia o estado numérico do córtex com a publicação autorizada do site; recarregar sem publicar descarta a sessão temporária.
- **Configuração universal:** adicione `behavior` ao JSON do host:

```json
{
 "behavior":{
  "enabled":true,
  "mode":"equilibrado",
  "minIntervalMs":120000,
  "maxPerDay":4,
  "toy":true
 }
}
```

Também há os modos `silencioso` e `brincalhao`. Nenhum modo autoriza alterações de código ou publicações automáticas. Leia [a arquitetura do cérebro](docs/CEREBRO_COMPORTAMENTAL.md) e [a comparação honesta com o Pestinha](docs/AUDITORIA_PESTINHA.md).

**Estado técnico:** existem testes automatizados e checagens do núcleo, mas ainda é necessária validação de ponta a ponta no navegador, conclusão do workflow de deployment e testes do aplicativo Windows antes de declarar superioridade funcional ao Pestinha.


## Alquimago v0.9 — contexto antes de efeitos

O avanço principal da v0.9 é **responder melhor**, não inflar números de neurônios.

- O mascote carrega uma base JSON de obras publicadas e responde perguntas sobre títulos, ferramentas, ano e categoria, **sem inventar fatos que não estão presentes**.
- Mantém a última obra em foco na conversa: depois de “Me fala da obra X”, entende “E quais ferramentas usou nela?”.
- O Local Studio publica \`alquimago/knowledge.json\` automaticamente junto do conteúdo autorizado, mantendo conhecimento e obras sincronizados.
- “Sim”, “nn”, matemática e ações de publicação ficam em fluxos explícitos e testáveis, separados do classificador de intenção.
- A versão compilada embute os pesos pré-treinados do classificador para não repetir o treinamento do zero em cada abertura.
- Interface da conversa com melhor legibilidade, mais espaço e controles avançados recolhidos.
- **IA generativa opcional:** um backend autenticado pode executar um modelo real. Nenhuma chave é incluída no JavaScript, e as mensagens só são enviadas após o usuário habilitar explicitamente esse modo. Sem backend, o motor contextual local funciona normalmente.

Veja [Assistente contextual e IA opcional](docs/ASSISTENTE_CONTEXTUAL.md).

**O que ainda não é verdade:** o Alquimago não virou um modelo generativo independente por causa do número de neurônios. O recurso de geração depende de um servidor e pode ter custos. No projeto padrão ele está desativado até que o responsável configure uma integração segura.

## Feedback visual com Gemini (v0.11.3)

Na integração do Local Studio, o usuário habilita o Gemini, escolhe um arquivo **JPEG, PNG ou WebP** de até **8 MB** e clica em **Analisar imagem com Gemini**. A prévia e o redimensionamento (lado maior até 1024 px) são locais. Somente o clique de análise envia o JPEG compactado ao endpoint seguro do host, que o encaminha ao Gemini. A imagem não é salva em lições, backups nem Git; a resposta textual aparece no grimório.

A análise local de pixels (`imageMetrics`) calcula luz, contraste e cor e **não reconhece objetos**. O Gemini oferece análise semântica remota, depende de rede e de quota e pode cometer erros. Nenhum conteúdo é aprendido a partir de um feedback visual sem aprovação.

A versão independente do bot não exige conta Gemini; cabe ao site integrador implementar o proxy `/api/assistant` mantendo sua chave somente no servidor. As obras e falas específicas do portfólio devem ficar em `assistant.spotlights` na configuração do host, e não no código genérico do bot.

Leia também [Integração e privacidade](docs/INTEGRACAO_PRIVACIDADE.md) e [Auditoria v0.11.3](docs/AUDITORIA_0_11_3.md).

## Cofre ALQ-V1 — criptografia de memória local (v0.11.4)

O Alquimago agora utiliza o formato próprio de cofre **ALQ-V1**, baseado em **AES-256-GCM da Web Crypto API**. Não utiliza um algoritmo criptográfico inventado, pois criptografia personalizada sem auditoria não é confiável. Uma chave AES de 256 bits, marcada como *não exportável*, é criada para cada namespace da instalação e armazenada no IndexedDB local, junto dos registros cifrados. Cada gravação usa um IV novo de 96 bits e autenticação de dados associada à versão e namespace para detectar adulterações.

A interface interna continua usando as funções de leitura/gravação já existentes, mas um adaptador seguro mantém os dados em memória durante a sessão e persiste o cofre cifrado no IndexedDB. Isso inclui diálogo, lições aprovadas, exemplos de linguagem, preferências, memória numérica, classificadores e estados de comportamento local. O bot tenta migrar os registros antigos do `localStorage`; só remove o texto legível **depois que o arquivo cifrado está gravado**. Em caso de falha de suporte, chave ausente ou corrupção, ele não faz fallback para novas gravações sem proteção.

**Limitação essencial:** uma chave não exportável dificulta extrair o valor bruto, mas não impede que outro script autorizado da **mesma origem** solicite operações de decriptação usando a chave. O cofre protege os dados em repouso contra leitura casual; ele não garante exclusividade absoluta do bot nem protege contra XSS, extensões maliciosas, comprometimento do dispositivo ou administradores do navegador. A perda do IndexedDB/chave torna a memória cifrada irrecuperável sem outro mecanismo de backup.

**O que não é criptografado:** o snapshot do Studio que o proprietário decide publicar em `public/alquimago/project-memory.json` continua público, assim como o JSON de projetos e o conteúdo do site. O backup de memória exportado manualmente ainda é **JSON sem criptografia** — trate-o como confidencial. A IA Gemini continua recebendo os dados enviados com consentimento, fora do cofre.

Leia a [arquitetura e o modelo de ameaças](docs/ALQ_VAULT.md).

## Publicação por comando e cofre de credencial (v0.11.5)

A frase configurável **“vai comprar pão”** é um atalho para abrir o diálogo de revisão de publicação no Local Studio. O bot consulta um **status de autorização** enviado pelo site integrador, sem ler nem registrar o valor da credencial: `missing` (“você ainda não me deu o dinheiro”), `ready` (autorização disponível), `expired` (“o pão mofou, posso jogar fora?”), `forbidden` (permissões insuficientes), `offline` e `unavailable`.

O núcleo **não recebe nem guarda tokens GitHub**. No portfólio que instala o Alquimago, o responsável pode guardar opcionalmente uma credencial de publicação no cofre AES-256-GCM do navegador, usando apenas a interface protegida de publicação, ou preferir a sessão GitHub App com criptografia no servidor. O bot só usa o status informado por evento; nenhuma credencial deve ser escrita no chat, enviada ao Gemini, incluída em memória ou publicada no repositório.

O comando nunca publica sozinho: o proprietário ainda precisa conferir as alterações e confirmar a publicação. A exclusão de um token inválido também exige confirmação explícita. Um cofre com chave local não exportável protege contra leitura casual do armazenamento, mas **não impede** que scripts maliciosos da mesma origem usem a autorização.

## Demo offline oficial — mesma versão do portfólio

Abra **[Alquimago_Demo_Offline.html](Alquimago_Demo_Offline.html)** diretamente no navegador depois de baixar **somente esse arquivo**. Ele já contém o JavaScript completo **v0.11.5**, a skin padrão **Orb 2D** (robô esférico com headset e olhos animados), expressões, grimório, diálogo e ferramentas locais. Não depende do arquivo `dist/alquimago.js`, de CDN, de hospedagem GitHub Pages ou de uma chave Gemini.

**Como atualizar:** sempre que evoluir o mascote, execute `npm run build`. A compilação agora atualiza **simultaneamente** `dist/alquimago.js`, `Alquimago_Demo_Offline.html`, `dist/Alquimago_Demo_Offline.html` e o rótulo de versão em `dist/index.html`. A automação de testes verifica que a demo contém **o mesmo bundle**, não uma implementação paralela. Não edite o JavaScript da demo manualmente.

**Limitação do modo `file://`:** alguns navegadores restringem WebCrypto ou IndexedDB em arquivos locais. O visual e as funcionalidades demonstrativas continuam disponíveis, mas o aprendizado persistente pode ficar desativado. O comando para publicar no GitHub depende da integração com o Local Studio no portfólio; a demo não recebe tokens nem cria commits. Gemini permanece desativado por padrão, pois o modo offline não tem API remota.
