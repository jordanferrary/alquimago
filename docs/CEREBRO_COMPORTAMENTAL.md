# Cérebro comportamental — Alquimago v0.7

## O que mudou

A rede de linguagem `src/neural.mjs` continua responsável pela **intenção das frases**. O novo `src/behavior.mjs` é responsável por **comportamentos espontâneos**. Ele não tenta ler janelas de outros programas, copiar dados ou produzir texto livre.

O sistema implementa **512 neurônios de integração e disparo com vazamento (LIF simplificado)**, **16.384 conexões esparsas**, **32 canais de estímulo** e **16 canais motores**. A topologia é gerada deterministicamente a partir de uma semente, evitando salvar dezenas de milhares de números toda vez que o usuário publica.

### Sensores (dados permitidos)

Os canais codificam o tipo de página, presença de problemas estruturais públicos, foco no projeto, mudança de rota, interações diretas com o mascote, intervalo sem interação, modo de edição, visibilidade da aba, preferência por movimento reduzido e os atributos numéricos do familiar. **Não capturam conteúdo digitado, títulos privados de janelas, senhas, áudio ou outras abas.**

### Como uma decisão é tomada

1. `behaviorSense` normaliza os 32 sinais.
2. `pulseCortex` executa seis pequenos passos de integração, decaimento e disparo. Os motores recebem sinais da rede.
3. `planCortexAlternatives` combina atividade dos motores, homeostase, utilidade contextual, condicionamento e habituação.
4. `tickCortex` filtra ações pelos limites de privacidade e frequência, optando por uma iniciativa apenas se houver utilidade suficiente.
5. `rewardCortex` recebe o feedback **Gostei** ou **Menos disso** e ajusta pesos motores, contexto e sinapses elegíveis. Cada feedback gera um episódio numérico limitado.

A rede escolhe entre observar, sugerir, investigar, saudar, brilhar, estudar, brincar, descansar, celebrar e outras ações simbólicas. **Nenhuma ação escreve arquivos, abre abas, modifica projetos nem publica alterações automaticamente.** Essas operações continuam dependendo de um comando explícito em outras partes do aplicativo.

### Autonomia responsável

A configuração fica no JSON do site:

```json
{
  "behavior": {
    "enabled": true,
    "mode": "equilibrado",
    "minIntervalMs": 120000,
    "maxPerDay": 4,
    "toy": true
  }
}
```

O campo `mode` aceita `silencioso`, `equilibrado` ou `brincalhao` (sem acento). A interface também permite pausar a autonomia. Há uma espera inicial de 45 segundos e limites internos para impedir comentários repetitivos. Ações são suspensas quando o usuário digita, abre o painel do mascote ou oculta a aba.

O modo **silencioso** desliga as iniciativas sem impedir interações manuais. A preferência por movimento reduzido desestimula efeitos visuais. O orbe físico é opcional e fica preso à área do mascote.

### Memória e continuidade

A memória comportamental armazena somente atributos numéricos, até 32 episódios `{action,context,reward,at}`, 16 valores motores, pesos contextuais e no máximo 128 deltas sinápticos. A topologia completa é reconstruída deterministicamente pelo `seed`.

- Modo `local`: gravada no navegador, por namespace de instalação.
- Modo `publish` (Local Studio): alterações ficam temporárias. O snapshot é incorporado ao commit autorizado do site; recarregar sem publicar restaura a memória pública anterior.
- Conversas de texto, nomes de obras, URLs visitadas e dados privados não entram no snapshot do córtex.

### Brincadeira física

`src/physics.mjs` simula um orbe com gravidade, colisões, amortecimento e arremesso por arraste. A área de jogo possui limites fixos e botão para fechar. Não interage com janelas do sistema operacional.

## Limitações perante o Pestinha

A existência de 512 neurônios **não prova** que este sistema seja mais inteligente que o Pestinha original: topologia, sensores, política e aprendizado são diferentes. O Pestinha permanece mais completo nas interações de sistema operacional, protestos, objetos físicos de desktop e condicionamento específico de cada contexto. A v0.7 amplia a autonomia **no navegador** e oferece integração com projetos React, feedback de recomendações e uma interface independente.

## Validação

`npm test` cobre a forma da rede, segurança da memória, cooldown, limitações diárias, recompensas, serialização e física do orbe. Validação em navegadores, desempenho real e build Windows devem ser confirmados antes de afirmar paridade total.
