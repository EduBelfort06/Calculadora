# CLAUDE.md

## Regras de uso das skills

Nomes conferidos na instalação local em 2026-11-20.

### Obrigatória
- **Ponytail** (`ponytail:ponytail`, plugin `ponytail@ponytail` 5.3.3): aplicar no início de toda tarefa. Use as instruções dela para manter as respostas concisas, fazer a menor mudança completa e evitar trabalho repetido. Não corte as verificações relevantes nem os detalhes necessários.

### Quando as instruções da própria skill se aplicam
- **Superpowers** (`superpowers:*`, plugin `superpowers@claude-plugins-official` 7.0.2): para processos de trabalho. Use `brainstorming` antes de criar funcionalidades, `systematic-debugging` em bugs, `test-driven-development` ao implementar e `verification-before-completion` antes de declarar algo pronto.
- **Taste Skill** (`taste-skill:design-taste-frontend`, plugin `taste-skill@taste-skill` 2.5.1): ao criar, redesenhar, restilizar, polir ou revisar o visual de páginas e sites (HTML/CSS).
- **Claude Men** = `claude-mem` (`claude-mem:*`, plugin `claude-mem@thedotmack` 16.0.1): memória entre sessões. Use `claude-mem:mem-search` quando a tarefa depender de trabalho de sessões anteriores e a ferramenta `work_state_write` para listas de tarefas de várias etapas. Skills pesadas como `learn-codebase` (lê todos os arquivos), `build`, `release` e `make-plan`/`do` só rodam a pedido.
- **One Skill to Rule Them All** (`task-observer`): não instalado. Não use até isso ser confirmado.
- **Carbone** (`carbone-skill:carbone`, plugin `carbone-skill@claude-plugins-official` 1.6.1): só para gerar documentos (DOCX, XLSX, PDF...) a partir de JSON. Não se aplica à calculadora. Não é a One Skill to Rule Them All.

### Execução
- Se duas skills pedirem a mesma etapa de planejamento, revisão ou testes, faça a etapa uma vez só, atendendo aos requisitos de ambas.
- Leia os arquivos necessários para entregar e validar a tarefa. Não carregue documentos sem relação com o pedido.
- Se um conflito entre instruções afetar a entrega, diga quais regras entraram em conflito e em que ponto.
- Conflito conhecido: Superpowers (`using-superpowers`) manda invocar uma skill se houver "1% de chance" de ela se aplicar, e isso choca com a regra de não carregar documentos sem relação com o pedido. Prevalece este arquivo, porque a própria Superpowers diz que as instruções do usuário (CLAUDE.md) têm precedência. Invoque uma skill só quando a descrição dela corresponder à tarefa.

- Sobreposição de planejamento: Superpowers (`writing-plans`/`executing-plans`) e claude-mem (`make-plan`/`do`) fazem a mesma etapa. Use só a Superpowers, a menos que o usuário peça a do claude-mem.
- Sobreposição de lista de tarefas: a Superpowers pede uma tarefa por item de checklist, e o claude-mem pede `work_state_write` no lugar da ferramenta de tarefas nativa. Registre cada item uma vez só, em `work_state_write`.
- Sobreposição de memória: o plugin `claude-memory@anthropic-plugin-directory` (skill `claude-memory:structured-memory`) também está instalado. Ele só entra quando o usuário pedir para configurar memória. A memória do dia a dia fica com o claude-mem.

### Skills não confirmadas
- **One Skill to Rule Them All**: o marketplace `one-skill-to-rule-them-all` foi adicionado e oferece os plugins `task-observer` e `task-observer-flush`, mas nenhum dos dois está instalado.
