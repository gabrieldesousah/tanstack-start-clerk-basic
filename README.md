# Project

# Todo

- [x] Bloquear videos sem legenda
- [x] Bloquear videos com legenda gerada automaticamente

- [ ] Processar o vídeo
  - [x] Gravar descrição, título e legenda
  - [ ] Particionar o conteúdo em "capítulos"
  - [x] Gerar questionamento sobre o vídeo
  - [x] Analisar o nível de dificuldade do inglês
  - [x] Fazer uma seleção de partes do conteúdo para aulas de gramática ou afins.
- [x] Mover o start/end para o Player. Poderemos usar isso no Audio e no vídeo

- [ ] Trilhas de conhecimento
- [ ] Testes de nivelamento

- [x] Atividades de repetição espaçada
- [x] Discovery de novas palavras
- [ ] Integração no WhatsApp
  - [ ] Enviar revisão de palavras
  - [ ] Enviar descoberta de novas palavras
  - [x] Usar o Generic Message ao invés do objeto de mensagem

## Gestão do chat - WhatsApp

- Todo chat é com um usuário e portanto precisa deste relacionamento
  - E quanto a leads?
    - Será um usuário sem acesso
- Toda mensagem precisa ser associada a um usuário
  - A cada mensagem receptiva, atualizar a janela de conversa do usuário
  - Sempre antes de enviar uma mensagem, verificar o lastReceivedMessageAt
  - Precisa de uma estrutura para manter uma interação.. saber qual foi o fluxo que entrou etc.
