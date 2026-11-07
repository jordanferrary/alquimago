# Skins do Alquimago

O familiar padrão usa SVG e não precisa de dependência. Uma imagem PNG/WebP ou um modelo GLB podem ser escolhidos **depois** que estiverem publicados na pasta do seu site. Não use URLs de outros domínios nem armazene segredos.

## Exemplo de opções no arquivo `alquimago/config.json`

```json
{
  "appearance": {
    "skins": [
      {"id":"padrao","label":"Padrão","type":"svg"},
      {"id":"desenho","label":"Arte 2D","type":"image","src":"./alquimago/skins/desenho.webp"},
      {"id":"mago-3d","label":"Alquimago 3D","type":"model3d",
       "src":"./alquimago/skins/mago.glb",
       "shapeKeys":{"idle":"Idle","blink":"Blink","happy":"Happy","curious":"Curious","talk":"Talk","pet":"Pet","sleep":"Sleep","focused":"Focused","sad":"Sad"}}
    ],
    "selectedSkin":"padrao"
  }
}
```

Para uma skin 3D o modelo precisa ter morph targets corretamente exportados no GLB. Os nomes de exemplo são **protocolo**, não modificam automaticamente os nomes que você usou no Blender. Se não houver morph target para uma emoção, o renderizador mantém o modelo sem essa expressão específica.

### Opt-in do renderizador 3D num projeto React

Instale `three` no **projeto anfitrião** e copie `react/three-skin-renderer.mjs` para o código desse projeto. No bootstrap, antes de carregar o mascote:

```js
import {registerThreeSkinRenderer} from './three-skin-renderer.mjs';
registerThreeSkinRenderer(window);
```

Ao escolher um perfil com `type: "model3d"`, o widget usa o adaptador registrado para carregar o GLB com transparência, permitir animações próprias e ajustar Morph Targets via `setExpression`. **Sem o adaptador o SVG permanece como fallback.** O app desktop e o site React podem usar o mesmo manifesto de Shape Keys.

O botão de skin fica em **Interagir → Ajustes e ferramentas → Aparência**. A seleção é feita em tempo real. No Local Studio, apenas perfis já cadastrados podem ser publicados; o arquivo de configuração recebe o ID da skin escolhida no mesmo commit autenticado. Não há importador de GLB pelo próprio widget neste momento: é preciso disponibilizar o GLB nas mídias do projeto de maneira autorizada.
