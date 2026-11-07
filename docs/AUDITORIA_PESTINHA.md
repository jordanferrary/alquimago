# Auditoria funcional — Pestinha original × Alquimago

**Revisão:** 2026-11-07. Referência pública: [mille-okws/pestinha](https://github.com/mille-okws/pestinha) e documentos `docs/ARQUITETURA.md`, `docs/REDE_NEURAL.md`, `pestinha/*/README.md`. Esta auditoria inclui as camadas e módulos centrais, não é prova de reprodução integral de cada caminho de código.

## Resultado principal

O original é um pet **desktop em Python/PySide6**, com rede LIF de 470 neurônios, 15.939 sinapses, 30 canais sensoriais e 15 motores. Usa condições/limiares, habituação, condicionamento, memória episódica, física e objetos flutuantes. O Alquimago é um widget Web/React e um projeto Tauri; sua rede de reconhecimento de intenções (96 entradas, 24 camadas internas, 12 saídas) **não é equivalente à rede comportamental LIF**. Exigir paridade total entre um navegador e um desktop sem distinguir as permissões produziria promessas falsas.

**Licenças:** o código do Pestinha é **GPL-3.0-or-later** e imagens/textos possuem condições separadas. O Alquimago deve implementar princípios e comportamentos **independentemente**, sem copiar arquivos ou assets de outro projeto e mantê-los como MIT. Caso um dia incorpore código GPL de fato, o licenciamento precisa ser reavaliado antes da distribuição.

## Camadas do Pestinha revisadas

| Referência original | Papel confirmado | Situação do Alquimago |
|---|---|---|
| `core/nervous_system.py` | rede LIF, habituação, aprendizado de três fatores, motores | **Parcial ampliado**: rede de intenções mais córtex LIF independente com 512 neurônios, 16.384 conexões, 32 sensores e 16 motores; não replica a topologia original |
| `core/homeostasis.py` e `emotion.py` | energia, carência, estímulo, humor | **Parcial ampliado**: energia/foco/curiosidade/afinidade e drive de energia, curiosidade, estímulo e confiança do córtex |
| `core/conditioning.py` | antecipação de eventos/estímulos | **Parcial**: recompensa contextual e reforço com feedback positivo/negativo; antecipação temporal completa ainda pendente |
| `core/episodic.py` | memória contextual, recompensa e consequências de ações | **Parcial**: preferência por tipos de dicas evolui com feedback útil/não priorizar, mas ainda não há episódios autônomos de travessuras |
| `core/physics.py` | gravidade, quique, arremesso e pouso | **Parcial ampliado**: orbe arcano com gravidade/quique/arremesso e movimento do mascote; sem pouso em janelas do SO |
| `body/pet.py` | corpo, gestos mouse, carinho | **Disponível**: clique, carinho horizontal, arraste e rodinha |
| `body/bolinha.py` e `toy.py` | brinquedo físico de tela | **Parcial**: orbe arcano físico no próprio widget, não no desktop inteiro |
| `mind/mesa.py` | notebook e trabalho | **Pendente** |
| `mind/mischief_ctl.py` | frequência e consequência das travessuras | **Pendente** |
| `mind/protest_ctl.py`, `castigo_ctl.py`, `revolucao.py` | protestos, cantinho e ações relacionadas | **Pendente** |
| `mind/sleep.py` e `festa.py` | sono, festa visual | **Parcial**: meditação e humor, sem mesmos efeitos |
| `sense/senses.py` e `plataforma/` | programa em primeiro plano, ociosidade, janelas do SO | **Desktop futuro**: navegador não possui acesso ao sistema |
| `world/mischief.py`, `objetos.py`, `notebook.py` | memes, bilhetes e objetos flutuantes | **Pendente** |
| `pets/<id>.json` | temperamento, conteúdo e visual por personagem | **Parcial**: regras por JSON, skins e textos externos por instalação |
| `store.py` e `paths.py` | persistência por pet, validação e escrita atômica | **Disponível parcialmente**: JSON local/namespaces e publicação GitHub por commit |
| `ui/`, `controle/` | permissões, pausa, pânico, monitor neural, menus | **Parcial**: menu compacto e botão fechar; painel neural avançado pendente |

## Funcionalidades próprias implementadas para Web/React

- **Observação da obra pelo cursor:** usa os atributos públicos `data-alquimago-project/category/year/tools`; a demora e o limite de repetição são configuráveis.
- **Visão heurística local:** amostra pixels de uma capa **na mesma origem** para medir luminosidade, contraste aproximado e cores; não identifica objetos nem substitui crítica artística humana.
- **Dicas específicas:** orientações por tipo de projeto, ferramentas e leitura visual; ao clicar na fala, abre a análise completa.
- **Aprendizado visível:** botão Ensinar guarda um protótipo numérico da frase, corrige sua classificação imediatamente e salva os pesos somente conforme o modo de memória configurado.
- **Preferências episódicas simples:** nas dicas de projetos, os botões 'Dica útil' e 'Não priorizar' ajustam uma memória numérica por categoria de arte, para mudar a ordem das orientações futuras.
- **Interface:** três abas principais, ferramentas recolhidas, scrollbar combinando com a paleta, painel visível em telas pequenas.
- **Idiomas:** português do Brasil embutido; idiomas adicionais exigem `language.file` com JSON público da mesma origem, respostas e exemplos de treino.
- **Skins:** perfil SVG padrão e imagem hospedada; GLB com Shape Keys por nome usando `react/three-skin-renderer.mjs` e a dependência opt-in `three` no projeto host. Sem adaptador, o modelo 3D cai para o SVG.
- **Publicação:** no Local Studio, a memória e os pesos ensinados só são gravados quando o proprietário usa Publicar; recarregar descarta o rascunho do mascote. Visitantes não têm seus dados publicados.

## Limitações e próximos componentes

1. **Decisões autônomas:** criar motor comportamental separado da rede de reconhecimento de texto: canais de estímulo, habituação, homeostase, memória episódica, taxas de ação e consentimento. Evitar comportamento que atrapalhe edição, tire foco ou bloqueie o usuário.
2. **Desktop Tauri:** adicionar sensores de janelas/programas somente com autorização explícita, com políticas de privacidade, sem leitura de conteúdo das janelas. Implementar física e interação com objetos usando uma área de trabalho controlada.
3. **Brincadeiras:** bolinha e objetos lúdicos no próprio overlay, com opção de desligar, sem esconder controles do usuário.
4. **Sistema de personagens:** packs de texto, emoção, aparência e memória por personagem, respeitando origens e licenças.
5. **Testes de ponta a ponta:** simulação de hover em galerias, carregamento de GLB real, vários tamanhos de tela, recarga sem publicar, publicação válida e aprendizado persistido.

**Progresso:** a versão Web foi ampliada, mas **não existe paridade integral com o Pestinha**. O objetivo é obter comportamento confiável, respeitar as capacidades de cada plataforma e evoluir o projeto de forma auditável.


## Atualização v0.7 — avaliação técnica

O Alquimago agora possui um córtex **LIF simplificado de 512 neurônios e 16.384 sinapses**, uma rede de linguagem separada, iniciativa contextual com limite de frequência, condicionamento positivo/negativo, habituação, episódios numéricos e orbe com física própria. A topologia é regenerável pela semente; apenas estados e deltas aprendidos são armazenados. O usuário controla a autonomia e pode colocá-lo em modo silencioso.

A rede neural pulsada do Alquimago **não é uma porta do código GPL** do Pestinha e os números de neurônios não comprovam qualidade superior. As duas implementações não passaram por benchmark funcional lado a lado. O original continua com vantagens em sensores de desktop, interação com janelas, protestos e objetos/rotinas específicas; o Alquimago tem ferramentas próprias para React, inspeção pública de projetos, skins e publicação segura.

| Critério | Status da v0.7 |
|---|---|
| Rede LIF comportamental | Implementada de modo independente, faltando teste de carga em dispositivos reais |
| Escolha de 16 comportamentos | Implementada com política contextual, impulsos dos motores e limites |
| Aprendizado por consequência | Implementado para ações avaliadas explicitamente pelo usuário |
| Memória numérica episódica | Implementada; no máximo 32 eventos, sem textos privados |
| Autonomia controlável | Implementada com modos, pausa, limite diário e proteção a edição |
| Brinquedo físico | Orbe com gravidade, colisões e arremesso dentro do widget |
| Sistema operacional | Acesso a janelas/programas externos continua pendente e exige permissões desktop |
| Paridade total com Pestinha | **Não alcançada nem demonstrada** |

Veja [CEREBRO_COMPORTAMENTAL.md](CEREBRO_COMPORTAMENTAL.md) para arquitetura e controles.
