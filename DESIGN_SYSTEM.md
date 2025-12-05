# DESIGN_SYSTEM.md

## 1. Princípios Visuais
*   **Clareza > Beleza:** Informação deve ser legível sob luz solar forte.
*   **Feedback Imediato:** Ações de sucesso/erro devem ser visíveis instantaneamente.
*   **Natureza Profissional:** Tons de verde que remetem a frescor, não a "brinquedo".

## 2. Paleta de Cores (Tailwind CSS)

### Primárias (Vegetação & Ação)
*   `bg-green-700` (#15803d): Botões primários, Header.
*   `bg-green-600` (#16a34a): Hover states.
*   `text-green-800` (#166534): Títulos, destaques fortes.

### Status (Semáforo de Colheita)
*   **Pronto (Esta semana):** `bg-emerald-100` text `emerald-800` border `emerald-500`
*   **Atenção (Próxima semana):** `bg-amber-100` text `amber-800` border `amber-500`
*   **Atrasado/Crítico:** `bg-red-100` text `red-800` border `red-500`

### Neutros
*   Fundo: `bg-slate-50` (#f8fafc) - Suave para os olhos.
*   Superfícies: `bg-white` (#ffffff) - Cards e Tabelas.
*   Texto Principal: `text-slate-900` (#0f172a).
*   Texto Secundário: `text-slate-500` (#64748b).

## 3. Tipografia
**Família:** Inter (Google Fonts)
*   Títulos: `font-bold` ou `font-semibold`.
*   Corpo: `text-sm` ou `text-base` para leitura confortável.
*   Dados Tabulares: `font-mono` para números (ex: quantidades, datas).

## 4. Componentes Base

### Card
```tsx
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
  {children}
</div>
```

### Badge de Status
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Ativo
</span>
```

### Botão Primário
```tsx
<button className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2">
  <Icon />
  <span>Label</span>
</button>
```