# ALQ-V1 — cofre local criptografado do Alquimago

## Objetivo e limites

O formato de armazenamento **ALQ-V1** é um envelope de dados próprio do Alquimago, mas **não** um algoritmo criptográfico próprio. Ele usa Web Crypto API com AES-256-GCM (criptografia autenticada). O objetivo é reduzir a exposição casual da memória local em armazenamento do navegador. Não promete que somente o bot consiga decriptografar, nem impede códigos maliciosos na mesma origem de invocar a chave.

## Onde a chave e os dados ficam

- IndexedDB: banco `alquimago-private-vault`, object store `records`.
- `key:{namespace}`: objeto CryptoKey AES-GCM gerado com `extractable=false`, sem exportação da chave bruta.
- `data:{namespace}`: objeto `{"format":"ALQ-V1","version":1,"iv":"...","payload":"..."}` com IV de 96 bits gerado aleatoriamente para cada gravação e payload em Base64.
- Autenticação vinculada ao namespace por AAD `alquimago:ALQ-V1:{namespace}` para rejeitar trocas de cofre.
- Os dados decifrados são mantidos apenas em memória durante a sessão via adaptador síncrono. Não são gravados em `localStorage`.

## Migração

1. A UI lê a configuração para identificar o namespace.
2. Busca a chave e o envelope existentes no IndexedDB.
3. Se for a primeira inicialização, gera e persiste uma chave não exportável.
4. Se não houver envelope, coleta os registros antigos permitidos (diálogo, lições, exemplos, modelo neural, preferências, estados numéricos).
5. Salva um único envelope criptografado **antes** de apagar as cópias antigas do `localStorage`.
6. A partir daí, o adaptador oferece os registros decifrados ao núcleo. Escritas são serializadas e cifradas antes de persistir.

Se a criptografia, IndexedDB ou a autenticação do ciphertext falharem, o Alquimago não faz fallback para escrita em texto puro. O código apresenta aviso; a memória já criptografada não é apagada automaticamente.

## O que protege

Registros locais do núcleo com prefixos permitidos `alquimago:*`, segregados por namespace. O cofre protege **dados em repouso** e detecta adulteração; ele não é um sistema de login.

## O que não protege

- Os dados do portfólio publicados em `public/`, em especial `project-memory.json` e `knowledge.json`.
- Backups JSON baixados manualmente: a exportação histórica é legível; não compartilhar.
- Dados transmitidos voluntariamente ao Gemini, que deixam o navegador.
- Ataques XSS, bibliotecas do mesmo site comprometidas, malware, extensão invasiva ou usuário com controle do dispositivo. Scripts da mesma origem podem solicitar operações com a CryptoKey armazenada.
- Perda do banco IndexedDB (limpeza de dados do site). Sem a chave a memória cifrada não pode ser recuperada; usar backups protegidos separadamente.

## Regras para evolução

Não inventar cifra, hash ou esquema de derivação. Se houver novos formatos, incrementar a versão e migrar com testes. Se o usuário solicitar exclusividade real de acesso, avaliar senha de desbloqueio **não armazenada**, derivação de chave resistente e isolamento em backend/autenticação do lado do servidor, com estratégia de recuperação.

## Testes

`npm test` executa `tests/vault.test.mjs`, cobrindo migração, falha sem WebCrypto, isolamento por namespace, chave não exportável, adulteração de ciphertext e preservação de dados na falha. `npm run build` deve gerar o JS de navegador sem imports ESM residuais.
