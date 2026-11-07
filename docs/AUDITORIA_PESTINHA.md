# Auditoria funcional — Pestinha original × Alquimago

**Revisão:** 2026-11-07. Referência pública: [mille-okws/pestinha](https://github.com/mille-okws/pestinha) e documentos `docs/ARQUITETURA.md`, `docs/REDE_NEURAL.md`, `pestinha/*/README.md`. Esta auditoria inclui as camadas e módulos centrais, não é prova de reprodução integral de cada caminho de código.

## Resultado principal

O original é um pet **desktop em Python/PySide6**, com rede LIF de 470 neurônios, 15.939 sinapses, 30 canais sensoriais e 15 motores. Usa condições/limiares, habituação, condicionamento, memória episódica, física e objetos flutuantes. O Alquimago é um widget Web/React e um projeto Tauri; sua rede de reconhecimento de intenções (96 entradas, 24 camadas internas, 12 saídas) **não é equivalente à rede comportamental LIF**. Exigir paridade total entre um navegador e um desktop sem distinguir as permissões produziria promessas falsas.

**Licenças:** o código do Pestinha é **GPL-3.0-or-later** e imagens/textos possuem condições separadas. O Alquimago deve implementar princípios e comportamentos **independentemente**, sem copiar arquivos ou assets de outro projeto e mantê-los como MIT. Caso um dia incorpore código GPL de fato, o licenciamento precisa ser reavaliado antes da distribuição.

## Camadas do Pestinha revisadas

| Referência original | Papel confirmado | Situação do Alquimago |
|---|---|---|
| `core/nervous_system.py` | rede LIF, habituação, aprendizado de três fatores, motores | **Parcial**: rede neural de intenção treinável; falta rede pulsada para decisões comportamentais |
| `core/homeostasis.py` e `emotion.py` | energia, carência, estímulo, humor | **Parcial**: energia/foco/curiosidade/afinidade e humor simbólico |
| `core/conditioning.py` | antecipação de eventos/estímulos | **Pendente** |
| `core/episodic.py` | memória contextual, recompensa e consequências de ações | **Pendente** para ações autônomas; aprendizado explícito de frases disponível |
| `core/physics.py` | gravidade, quique, arremesso e pouso | **Parcial**: mover e girar o mascote, sem física equivalente |
| `body/pet.py` | corpo, gestos mouse, carinho | **Disponível**: clique, carinho horizontal, arraste e rodinha |
| `body/bolinha.py` e `toy.py` | brinquedo físico de tela | **Pendente** |
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
