# Modelo de segurança — Alquimago

## Versão web atual

O código remoto executa na origem do site onde foi incluído. Portanto, mesmo com Shadow DOM, um script hospedado remotamente **não é um sandbox de segurança**. Antes de incluir em produção, o dono do site deve revisar o conteúdo e decidir se confia na fonte.

O Alquimago v0.1, por projeto, não faz solicitações de rede, não coleta dados de formulários, não lê cookies, não coleta tokens e não tenta explorar permissões do navegador. O único acesso de navegação externa ocorre por clique explícito em ChatGPT ou Gemini. O prompt colocado na área de transferência contém apenas o título, URL base e contagens do DOM da página — não mensagens ou conteúdo de formulários.

O estado do personagem fica no localStorage da origem. Isso pode ser limpo manualmente nas ferramentas de desenvolvedor do navegador usando a chave `alquimago:v1`. Dados de um domínio não são automaticamente compartilhados com outro.

## Desktop atual

A janela Tauri recebe permissões de janela mínimas, apenas para arrastar e fechar. Não possui comandos de filesystem, shell, rede ou GitHub. Essas capacidades são roadmap, não recursos atuais.

## Para futuros agentes de edição

- Consentimento claro antes de acessar arquivos ou abrir uma sessão de navegação.
- `allowlist` de diretórios, APIs e recursos; negar escopos fora de projeto.
- Tokens somente em serviços de armazenamento seguro do sistema, nunca no frontend.
- Diff + teste + confirmação antes de gravar em repositório ou publicar.
- Checkpoint recuperável e log de operações.
- Nunca tentar burlar limites de serviços ou automatizar logins em interfaces web não autorizadas.
