# ✦ Alquimago — Familiar Arcano Digital

Um mascote interativo leve para **sites React, Vite e páginas HTML**, com a mesma personalidade em uma **versão desktop Windows (Tauri 2)**.

> **Estado: protótipo v0.1.0.** Não é um agente de IA autônomo. A experiência de mascote, memória local, navegação por rotas do próprio site e auditoria DOM simples já estão implementadas. Edição de arquivos, integração autenticada com GitHub e automação de IA são propostas para versões futuras.

## O que funciona agora

- Personagem original em SVG, com visual de mago, animações, emoções e interação por clique/arrastar.
- Memória local de energia, curiosidade, foco, afinidade, XP e posição (localStorage do próprio site).
- Painel independente do CSS do site, com Shadow DOM para evitar conflito de estilos.
- Identificação das rotas internas por links locais; navegação somente após escolha do usuário.
- Auditoria básica do DOM: links, botões, imagens com `alt` ausente, IDs duplicados e imagens quebradas.
- Preparação de prompt de contexto, abertura de ChatGPT/Gemini mediante clique **sem automatizar o uso dessas plataformas**.
- Projeto de aplicativo desktop Tauri 2 para Windows, reutilizando o mesmo widget.

## Instalar no portfólio React: uma linha, uma vez

Depois de ativar GitHub Pages para o repositório `jordanferrary/alquimago`, adicione ao `index.html` do seu site, antes de `</body>`:

```html
<script defer src="https://jordanferrary.github.io/alquimago/alquimago.js"></script>
```

**Não precisa alterar nada a cada publicação do site.** O arquivo é atualizado no repositório Alquimago. Mudanças remotas podem sofrer cache do navegador, e a nova versão será carregada quando o cache se atualizar. O próprio widget não publica código do seu site.

Se seu repositório tiver outro nome ou se o usuário do GitHub mudar, ajuste essa URL uma única vez.

### Alternativa via componente React (sem depender de um script global)

Copie `react/Alquimago.tsx` para o projeto e monte o componente:

```tsx
import { Alquimago } from './components/Alquimago';

export default function App() {
  return <><main>Meu portfólio</main><Alquimago src="https://jordanferrary.github.io/alquimago/alquimago.js" /></>;
}
```

Não combine as duas formas no mesmo site, para evitar duas instâncias.

## Visualizar no computador sem instalar nada

Após extrair o ZIP, execute no terminal na pasta do projeto:

```bash
npm test
npm run build
```

Para a demonstração web, use um servidor HTTP estático local (por exemplo, a extensão Live Server do VS Code) com a pasta `dist/` e abra `index.html`. Também é possível abrir o arquivo diretamente no navegador, mas recursos como área de transferência podem exigir HTTPS ou localhost.

## Criar o repositório separado

1. Abra https://github.com/new e crie um repositório chamado `alquimago` na conta `jordanferrary`. Marque como **público** se quiser GitHub Pages gratuitamente no plano Free. Deixe sem README automático, pois este pacote já inclui um.
2. Faça upload dos arquivos extraídos do ZIP para o repositório (mantenha pastas como `src/`, `dist/` e `.github/`). Quem usa Git local pode simplesmente enviar a pasta com `git push`.
3. No GitHub, vá em **Settings > Pages**, escolha **GitHub Actions**. O workflow `.github/workflows/pages.yml` publica `dist/` automaticamente.
4. Após a publicação, adicione a única linha do script ao portfólio.

Se você conectar ou criar o repositório, o ChatGPT com acesso de edição ao GitHub pode ajudar a publicar e atualizar os arquivos diretamente quando a integração permitir.

## Versão Windows (desktop)

O código está em `src-tauri/`. Para compilar no Windows, é necessário **Rust**, **Node.js** e os requisitos de desenvolvimento do Tauri 2 (WebView2/Build Tools conforme a documentação oficial).

```bash
npm install
npm run desktop:build
```

Ou, depois de criar o repositório, abra **Actions > Compilar Alquimago para Windows > Run workflow**. O instalador `.exe` deverá ficar nos artefatos da execução, se a compilação for bem-sucedida.

> A build do desktop ainda **não foi compilada/testada em Windows** neste ambiente. O workflow e a configuração estão preparados para compilação posterior; não há instalador `.exe` pré-gerado neste ZIP.

## Arquitetura

```text
src/brain.mjs            Núcleo determinístico e adaptativo
src/widget.js            Personagem, interface, navegação e eventos
scripts/build.mjs        Empacota um único script sem dependências de runtime
dist/                    Widget pronto + demonstração + tela do app desktop
react/Alquimago.tsx      Adaptador React opcional
src-tauri/               Aplicativo desktop Tauri 2
.github/workflows/       Publicação no GitHub Pages e build Windows
tests/                   Testes unitários do comportamento
docs/                    Limites, segurança, origem e roadmap
```

## Segurança e privacidade

- Nenhuma chave ou token é solicitada, armazenada ou enviada pelo widget.
- O widget não acessa sistema de arquivos local nem repositórios GitHub.
- Não interage automaticamente com páginas do ChatGPT/Gemini; abre esses sites apenas após clique do usuário e copia um prompt por solicitação.
- A auditoria examina apenas metadados básicos do DOM da página atual, sem copiar formulários ou mensagens.
- Os estados ficam em `localStorage` da origem em que o widget executa (isolados entre domínios).
- Ao adicionar scripts remotos a um site, você está confiando no código remoto; hospedar em repositório próprio e revisar alterações é importante. Utilize política CSP e versionamento quando for produção.

## Licença e inspiração

Código e visual deste protótipo escritos de forma independente sob **MIT**. Inspirado no conceito de mascote adaptativo de desktop do projeto público [Pestinha](https://github.com/mille-okws/pestinha), de mille-okws, que utiliza GPL-3.0-or-later. **Não copiamos o código nem os assets do Pestinha.** Consulte `docs/ORIGEM_E_LICENCAS.md`.
