
<div align="center">
  <br />
  <h1>🌱 Solawi Manager v2</h1>
  
  <p>
    <strong>Planejamento de cultivo simples, offline-first e multilíngue para Agricultura Solidária (CSAs).</strong>
  </p>

  <p>
    <a href="https://github.com/brenoqbezerra/Solawi-Manager/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License MIT" />
    </a>
    <img src="https://img.shields.io/badge/Status-MVP-orange" alt="Status" />
    <img src="https://img.shields.io/badge/Focus-Solidarische%20Landwirtschaft-15803d" alt="Solawi" />
    <img src="https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20Tailwind-blue" alt="Tech Stack" />
  </p>

  <p>
    <a href="#-sobre-o-projeto">Sobre</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-como-rodar">Como Rodar</a> •
    <a href="#-inspiração">Inspiração</a>
  </p>
</div>

---

## 📸 Preview

<div align="center">
  <!-- Substitua este link pela imagem real do seu dashboard após tirar o print -->
  <img src="./public/screenshot-desktop.png" alt="Solawi Manager Dashboard Desktop" width="100%" style="border-radius: 10px; border: 1px solid #e2e8f0;" />
</div>

<br />

<div align="center" style="display: flex; gap: 10px; justify-content: center;">
   <!-- Substitua este link pela imagem real mobile -->
  <img src="./public/screenshot-mobile.png" alt="Solawi Manager Mobile" width="30%" style="border-radius: 10px; border: 1px solid #e2e8f0;" />
</div>

---

## 🌾 Sobre o Projeto

O **Solawi Manager v2** é uma ferramenta de gestão agrícola projetada especificamente para o modelo *Solidarische Landwirtschaft* (Solawi) na Alemanha, mas adaptável para CSAs globalmente.

O objetivo é resolver a dor de pequenos agricultores que perdem tempo com planilhas complexas (Excel) que não funcionam no campo. O sistema é focado em **ação rápida**, **clareza visual** e **independência de conexão** (Offline-First).

### 🌟 "Concebido a partir da observação e curiosidade"

> *"Nos arredores de Dresden, no projeto **Wandelgrund**, surgiu a pergunta: Como a tecnologia pode simplificar o trabalho na fazenda sem ofuscá-lo?"*

Este projeto é um **MVP (Produto Mínimo Viável)** consciente: simples, armazenado localmente no navegador do usuário e sem necessidade de servidores complexos.

---

## 🚀 Funcionalidades

*   **📊 Dashboard Visual:** Visão imediata de culturas ativas, colheitas da semana e atrasos (Sistema de Semáforo).
*   **📅 Planejamento em KW:** Uso de *Kalenderwoche* (Semanas do Calendário), essencial para o ritmo agrícola alemão.
*   **🚜 Registro de Colheita:** Controle de planejado vs. realizado com suporte a colheitas parciais.
*   **🌡️ Previsão do Tempo:** Integração com Open-Meteo para previsão de 7 dias baseada na localização exata.
*   **🌍 Multilíngue:** Suporte nativo e troca instantânea entre **Alemão (DE), Inglês (EN), Espanhol (ES), Francês (FR) e Português (PT)**.
*   **📱 Mobile-First:** Interface totalmente adaptada para uso no campo via celular.
*   **🔒 Privacidade:** Todos os dados são salvos no `localStorage` do navegador. Nada sai do dispositivo do usuário.

---

## 🛠 Tecnologias

*   **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build:** [Vite](https://vitejs.dev/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Gráficos:** [Recharts](https://recharts.org/)
*   **Dados:** LocalStorage (No Backend) + Open-Meteo API (Weather)

---

## 🏃‍♂️ Como Rodar

```bash
# 1. Clone o repositório
git clone https://github.com/brenoqbezerra/Solawi-Manager.git

# 2. Entre na pasta
cd Solawi-Manager

# 3. Instale as dependências
npm install

# 4. Rode o servidor de desenvolvimento
npm run dev
```

O projeto rodará em `http://localhost:5173`.

---

## 💡 Inspiração

Este projeto não seria possível sem a inspiração de iniciativas reais:

*   **[Wandelgrund](https://wandelgrund.org/):** Onde a semente da ideia foi plantada através da vivência prática.
*   **[WirGarten](https://www.wirgarten.com/):** Cuja planilha de planejamento analógico serviu de base lógica para a digitalização deste sistema.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

Basicamente: Você pode usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender cópias do software, desde que mantenha os créditos do autor original.

---

<div align="center">
  <p>Desenvolvido com 💚 por <a href="https://www.linkedin.com/in/brenoqbezerra/">Breno Bezerra</a></p>
  <p><em>Dresden, Alemanha 🇩🇪 -> Brasil 🇧🇷</em></p>
</div>
