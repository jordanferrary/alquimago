# Idiomas adicionais

O Alquimago tem **português brasileiro embutido**. Uma tradução precisa ser fornecida em um JSON **público da mesma origem**, referenciado em `language.file` no arquivo de configuração. O pacote deve trazer textos da UI, respostas e frases de treinamento para o idioma escolhido. Não existe tradução automática.

```json
{
 "language":{"code":"en","file":"./alquimago/locales/en.json"}
}
```

Exemplo da estrutura de `en.json` (somente demonstrativo, não é um pacote completo):

```json
{
 "code":"en",
 "tabs":{"chat":"Chat","insights":"Observe","actions":"Interact"},
 "ui":{"message":"Ask the familiar...","send":"Send","learn":"Teach","close":"Close"},
 "intentLabels":{"greeting":"Greeting","insight":"Suggestion"},
 "intentSamples":{"greeting":["hello","hi there"],"insight":["any feedback on this project?"]},
 "responses":{"greeting":"Hello! I'm {name}.","insight":"I can comment on public project information."}
}
```

Somente os exemplos e respostas explicitamente adicionados passam a existir naquele idioma. O classificador não gera tradução automática de frases, e respostas complexas ainda exigem um modelo externo escolhido pelo usuário.
