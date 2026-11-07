# Pipeline oficial — Skins 3D do Alquimago

> Guia para Blender → GLB → Local Studio → Cloudflare Pages.
> **Estado:** integração em branch de teste; testar renderização e publicação antes de mesclar à produção.

## 1. Formato aceito

- **Obrigatório:** glTF 2.0 **Binary (.glb)**, com malha, materiais e texturas no mesmo arquivo.
- **Limite no importador do Studio:** até **18 MiB** (18 × 1.048.576 bytes). Meta de desempenho: 2–8 MiB.
- **Limite da Cloudflare Pages:** 25 MiB por arquivo de asset. O importador adota um limite menor por desempenho e margem de segurança.
- `.blend`, `.fbx` e `.obj` são arquivos-fonte: precisam ser exportados para `.glb`; não são aceitos diretamente no Studio.
- O arquivo exportado deve conter ao menos uma Mesh visualizável. O renderizador usa uma câmera frontal automática e centraliza o objeto com base na bounding box.
- Materiais preferenciais: PBR metálico/roughness ou emissive. Evite materiais de nós procedurais sem baking.
- Texturas: preferir até 1K (1024 × 1024), 2K apenas quando indispensável; mantenha o peso final baixo.
- Geometria: alvo de **5 mil a 30 mil triângulos** para o mascote, menos para dispositivos fracos. Isso é recomendação de otimização, não uma restrição técnica rígida.
- Não dependa de bibliotecas de compressão Draco ou Meshopt nesta versão: exporte GLB padrão, sem essas extensões, para funcionar com o carregador incluído.

## 2. Convenção de Shape Keys

Crie `Basis` como primeira Shape Key. Depois crie **exatamente** os seguintes nomes na malha facial, com maiúsculas e minúsculas iguais:

| Nome | Para quê | Quando o Alquimago ativa |
|---|---|---|
| `Idle` | Neutralidade respirável / microexpressão | Em repouso (opcional, sutil) |
| `Blink` | Fecha ambos os olhos | Piscadas automáticas |
| `Happy` | Sorriso/felicidade | Feliz ou animado |
| `Curious` | Sobrancelhas/olhar interessado | Curiosidade |
| `Talk` | Abre a boca | Conversa ou fala temporária |
| `Sleep` | Pálpebras relaxadas / olhos fechados | Meditando ou sonolento |
| `Pet` | Expressão de carinho | Ao acariciar o personagem |
| `Surprised` | Espanto | Evento de surpresa / teste manual |
| `Focused` | Concentração | Foco alto |
| `Sad` | Tristeza | Estado triste / teste manual |

Regras:

1. Mantenha a **mesma quantidade e ordem de vértices** em todas as Shape Keys.
2. Os valores utilizados são contínuos de **0 a 1**, interpolados suavemente no navegador.
3. As expressões podem se somar (por exemplo, `Happy` e `Blink`). Evite grandes deslocamentos conflitantes nos mesmos vértices.
4. `Basis` é neutra: **não** faça o rosto neutro em `Happy` ou `Talk`.
5. O nome dos Morph Targets precisa sobreviver à exportação; o GLB é examinado pelo importador.
6. Se alguma chave estiver ausente, a skin ainda será carregada e aquela emoção ficará neutra. O Studio indicará quais faltaram.
7. Se o rosto for separado em várias meshes, o renderizador detecta as Shape Keys de cada mesh; prefira uma malha de rosto clara para manutenção.
8. A animação que o Alquimago faz automaticamente controla **Morph Targets**. Clipes de armature, física, colisão e animação locomotora não são executados por este adaptador.


### Expressões adicionais opcionais — nomes exatos

O Alquimago reconhece as Shape Keys adicionais abaixo se estiverem presentes no GLB. A ausência delas não impede o carregamento.

| Nome | Uso |
|---|---|
| **Tired** | Cansaço automático quando a energia do familiar fica baixa |
| **Yawn** | Bocejo periódico enquanto estiver cansado |
| **Angry** | Raiva, testável manualmente no Ateliê |
| **Confused** | Confusão, testável manualmente |
| **Excited** | Empolgação combinada sutilmente com felicidade |
| **Shy** | Timidez, testável manualmente |
| **Love** | Carinho misturado à expressão Pet |
| **Proud** | Orgulho na publicação |
| **Thinking** | Reflexão misturada à concentração |
| **Worried** | Preocupação, testável manualmente |
| **Laugh** | Risada, testável manualmente |
| **LookLeft** | Olhar à esquerda, opcional no acompanhamento do cursor |
| **LookRight** | Olhar à direita |
| **LookUp** | Olhar para cima |
| **LookDown** | Olhar para baixo |

As expressões indicadas como testes manuais **não** são emoções inferidas automaticamente pelo Gemini. Os estados locais governam as expressões, e o olhar usa uma rotação discreta. As quatro Shape Keys de olhar refinam o movimento dos olhos, mas não são obrigatórias.

### Janela 3D e enquadramento

O personagem 3D agora fica em uma janela/moldura com alça de redimensionamento no canto. No **Local Studio > Conteúdo > Skin 3D do Alquimago**, seção **Janela e enquadramento 3D**, há controles para largura, altura, zoom, deslocamento horizontal/vertical, seguir o mouse e restaurar enquadramento.

- Largura permitida: 145–420 px. Altura: 175–475 px. São limites de interface.
- Zoom de câmera: 0,65 a 2,6 vezes, também ajustável com **Shift + roda do mouse** sobre o mascote.
- Deslocamento horizontal e vertical refinam onde a janela aparece.
- O comportamento existente de arrastar o Alquimago na página permanece.
- O olhar segue o mouse suavemente e pode ser desligado; a preferência de movimento reduzido é respeitada.
- Alterações são locais até a publicação explícita no Local Studio; o enquadramento publicado fica na configuração pública, para visitantes receberem o mesmo padrão.

### Reações de carinho

No modo 3D, tocar/acariciar ativa a Shape Key **Pet** (e opcionalmente **Love**) com interpolação suave, em vez da explosão gráfica de corações. O modo SVG mantém sua reação antiga. Se o carregamento GLB/WebGL falhar, o familiar retorna à skin SVG.

## 3. Preparação no Blender

1. Modele o personagem voltado para a frente e aplique transformações coerentes (principalmente escala, preferencialmente `1,1,1`).
2. Na malha facial: Object Data Properties (ícone de triângulo verde) → Shape Keys → `+` para criar `Basis`.
3. Adicione as dez keys acima; edite a forma de cada uma com Value=1, mantendo outras em 0 durante a escultura.
4. Confira que todas voltam corretamente a 0 e 1; teste combinações como `Blink` + `Happy`.
5. UV unwrap; use texturas e materiais exportáveis em glTF.
6. Exportar → **glTF 2.0** → Format: **glTF Binary (.glb)**.
7. Ative **Shape Keys / Morph Targets** e os atributos de mesh necessários. Exporte materiais/texturas; as opções exatas mudam conforme a versão do Blender.
8. Verifique o modelo exportado em um visualizador glTF. Se parecer invertido, corrija a orientação na fonte e exporte novamente.
9. No Local Studio → Ferramentas → **Skin 3D do Alquimago**, selecione o GLB. O editor valida versão GLB 2, peso e nomes das Shape Keys.
10. Visualize no familiar, teste as expressões e só então clique em **Publicar skin e alterações**.

## 4. Publicação e armazenamento

- A importação fica primeiro no **IndexedDB deste navegador e deste domínio**, como um rascunho. Não é enviada ao Google Gemini.
- A prévia lê o GLB local e ativa o perfil `custom-3d` do Alquimago.
- Ao publicar pelo Local Studio, o mesmo commit inclui `public/alquimago/skins/custom.glb` e marca a skin selecionada em `public/alquimago/config.json`.
- **GitHub** recebe o binário; **Cloudflare Pages** compila e distribui o ativo. Não envie o GLB como texto no JSON.
- O modelo hospedado é público, assim como as demais imagens do portfólio. Não coloque conteúdo privado dentro dele.
- A memória/preview de arquivos do navegador não é sincronizada entre `pages.dev` e domínios personalizados; o GLB publicado é distribuído pelo próprio site.
- É possível voltar à skin SVG sem apagar a GLB do repositório.
- O seletor de skins é livre para visitantes, mas **somente o proprietário autenticado no Local Studio** consegue importar e publicar novos arquivos.

## 5. Teste de aceitação

- [ ] Exportou `.glb` e importador confirmou versão 2.0.
- [ ] A imagem 3D aparece sobre o botão do mascote; sem travar a galeria.
- [ ] Todas as dez keys foram reconhecidas (ou ausências explicitadas).
- [ ] Os botões de teste mudam expressões e o rosto pisca sozinho.
- [ ] Voltar à skin SVG continua funcionando.
- [ ] Ao publicar, `public/alquimago/skins/custom.glb` está no GitHub.
- [ ] Cloudflare Pages conclui o build do novo commit.
- [ ] O modelo continua renderizando em janela anônima sem acesso ao IndexedDB do editor.
- [ ] O Alquimago continua conversando com o Gemini mesmo sem usar skin 3D.

## 6. Erros frequentes

- **Apenas um cubo ou tela vazia:** verifique se há Mesh real, se a câmera está para a frente e se o asset foi exportado em GLB.
- **Shape Keys ausentes:** confira ortografia, a configuração de exportação e se elas estão na Mesh exportada.
- **Materiais sem aparência do Blender:** realize bake/ajuste materiais PBR e reexporte.
- **Modelo pesado ou lento:** reduza polígonos, texturas e materiais e teste em dispositivo mais fraco.
- **Funciona antes de publicar, mas não depois:** confirme que o arquivo está no repositório e no deployment, não somente no IndexedDB.
- **Caminho errado:** o contrato de publicação é fixo: `/alquimago/skins/custom.glb`.

Fontes técnicas:
- [Three.js Loading 3D Models](https://threejs.org/manual/en/load-gltf.html)
- [Three.js GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [Cloudflare Pages file size limits](https://developers.cloudflare.com/pages/platform/limits/)


## Atualização: Breath, direção de animação e enquadramento

**Nova Shape Key: Breath.** No Blender, crie Breath na malha que contém o tórax. Em Value=0, deixe o peito neutro; em Value=1, faça a expansão máxima de uma inspiração. Não salve a expansão na Basis. O Alquimago executa uma onda cíclica 0 → 1 → 0, suavizada, sobre a intensidade configurada. A velocidade muda conforme o estado local (tranquilo, feliz, animado, curioso, concentrado, sonolento, meditando ou cansado).

**Cada skin tem direção de animação própria.** Abra Local Studio → Ferramentas → Familiar → Ateliê do Alquimago → **Animações**. Você poderá ajustar duração e intensidade de **todas as Shape Keys** reconhecidas, assim como o intervalo de piscadas e bocejos. Para Breath, ajuste duração base, intensidade e velocidade relativa por humor. Os valores ficam no armazenamento local até a publicação aprovada, quando o perfil passa ao campo público appearance.animation3d de config.json.

**Rosto sem cortar o enquadramento:** o Ateliê → **Câmera** oferece os presets Rosto, Busto e Corpo inteiro, seguidos por Zoom, Foco X, Foco Y, Rotação (yaw) e deslocamentos da janela. Os controles de foco movem o ponto da câmera dentro do modelo; os deslocamentos X/Y externos movem somente a janela. Caso o rosto não esteja centralizado depois do preset, refine Foco Y e Zoom. O padrão publicado fica em appearance.stage3d.

**Organização do produto:** O Local Studio inclui uma área **Familiar**, com acesso direto ao Grimório e ao Ateliê, e uma busca por ferramentas. O Grimório foi organizado como conversa principal com os recursos de treinamento e mentor em uma seção recolhível. O **mascote é exibido no portfólio público**, onde pode reagir e ser visualizado; o **chat de IA generativa aparece somente com o Local Studio desbloqueado**. Isto é uma separação de interface, não autenticação do endpoint Cloudflare: a rota /api/assistant continua pública e pode consumir a cota Gemini.

Não publique um novo GLB sem testar as Shape Keys, o posicionamento em celular e a operação do mascote depois de recarregar. O formato recomendado continua glTF Binary 2.0 (.glb).
