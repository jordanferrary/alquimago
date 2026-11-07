# Estudo técnico e direitos autorais

## Referência externa

- Repositório original: https://github.com/mille-okws/pestinha
- Implementação pública no momento da análise: Python 3.11+, PySide6, funções de leitura de eventos e janelas, rede neural pulsada declarada de 470 neurônios, memória em arquivos locais, personagens com conteúdo separado.
- O Pestinha é GPL-3.0-or-later; imagens e textos possuem condições próprias, conforme o README.

## Reimplementação independente

O Alquimago cria seu próprio personagem em SVG e implementa um modelo comportamental simples (energia, curiosidade, foco, afinidade e reforço por interações). Não transportamos `pestinha/`, `pets/`, `assets/`, módulos Python, pesos de rede neural ou algoritmos específicos do programa original.

O objetivo é reproduzir a **categoria funcional** (mascote de tela que interage e evolui) em ambiente web e aplicativo desktop, **não uma cópia fiel de engenharia binária**. A rede neural do Pestinha não foi reproduzida nem alegamos equivalência funcional com ela.

Se no futuro o projeto incorporar qualquer código GPL do original, antes de distribuir será necessário reavaliar a licença e cumprir as obrigações aplicáveis; não basta manter a atribuição deste documento.
