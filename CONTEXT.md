# CONTEXT.md — Solawi Manager v2

## 1. Visão do Produto
O **Solawi Manager v2** é uma ferramenta de gestão agrícola projetada especificamente para o modelo *Solidarische Landwirtschaft* (Solawi) na Alemanha, mas adaptável para CSAs (Comunidade que Sustenta a Agricultura) globalmente. 

**O Problema:** Pequenos agricultores perdem tempo valioso com planilhas complexas (Excel/Google Sheets) que não funcionam bem em celulares, não oferecem alertas proativos e desconectam o planejamento da realidade climática.

**A Solução:** Um Web App "Offline-First", visual e focado em ações rápidas. O agricultor deve conseguir registrar um plantio ou consultar uma colheita em menos de 2 minutos, mesmo com luvas e no campo.

## 2. Público-Alvo
*   **Agricultores de Pequeno Porte:** Focam na diversidade de culturas (hortaliças) e não em monocultura.
*   **Gerentes de Cooperativas:** Precisam visualizar o fluxo de colheita semanal (Kalenderwoche - KW) para montar as cestas dos membros.

## 3. Lições da Versão 1 (Legacy)
*   **Erro:** Dependência de Google Apps Script tornou o sistema lento e difícil de manter.
*   **Erro:** Interface não era responsiva; o agricultor tinha que ir ao escritório usar o PC.
*   **Acerto:** O uso de Semanas do Calendário (KW) é fundamental para o ritmo agrícola na Alemanha. Isso foi mantido e aprimorado.

## 4. Diferenciais da v2
*   **UX Agrícola:** Botões grandes, alto contraste, indicação visual de status (Semáforo: Verde/Amarelo/Vermelho).
*   **Inteligência Climática:** Integração nativa com previsão do tempo para auxiliar na decisão de plantio/colheita.
*   **Zero Config:** O MVP roda localmente no navegador (LocalStorage), sem necessidade de configurar servidores complexos inicialmente.