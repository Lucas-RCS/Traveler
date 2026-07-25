# Traveler

Um editor de mapas interativo para campanhas de RPG de mesa, construído com React, TypeScript e Vite. Permite desenhar regiões, traçar rotas e marcar pontos de interesse sobre o mapa de uma campanha, além de simular viagens de caravana com consumo de suprimentos, moral e fadiga.

🔗 **Demo:** [traveler.lucasribeiro.dev.br](https://traveler.lucasribeiro.dev.br/)

---

## ✨ Funcionalidades

- **Editor de mapa** com zoom, pan e mini-mapa de navegação
- **Regiões customizáveis**: florestas, reinos, desertos, montanhas, mares, pântanos e mais — cada uma com bioma, clima, cor, tags e anotações próprias
- **Rotas entre pontos de interesse**: estradas, trilhas, túneis, atalhos e rotas marítimas, com distância, custo de suprimentos e obstáculos
- **Pontos de interesse (POIs)**: cidades, vilas, ruínas, templos, portos, castelos, acampamentos e marcos
- **Comentários no mapa**, com autor, avatar e status de resolvido/pendente
- **Painel de camadas** para exibir, ocultar e bloquear elementos do mapa
- **Painel de inspeção** para editar detalhes de qualquer elemento selecionado
- **Planejador de viagem**: monte uma caravana (defesa, suporte, diplomacia, bônus de sentinelas, guias e sábios) e simule o trajeto entre origem e destino, com consumo de suprimentos e acúmulo de fadiga/moral
- **Exportação e importação de campanhas** exporte o mapa em JPG, SVG, PNG ou JSON, e importe campanhas a partir de um arquivo JSON.
- **Paleta de comandos** (busca rápida por regiões, rotas, POIs e camadas)
- **Tema claro/escuro**

## 🛠️ Tecnologias

| Categoria          | Stack                        |
| ------------------ | ---------------------------- |
| Core               | React 19, TypeScript, Vite 6 |
| Estilização        | Tailwind CSS 4               |
| Animações & Ícones | Motion, Lucide React         |
| Datas              | Moment.js                    |

## 📂 Estrutura do projeto

```
src/
├── imgs/                     # Logo, favicon e imagens estáticas
├── components/
│   ├── MapCanvas.tsx          # Canvas principal de renderização do mapa
│   ├── FloatingToolbar.tsx    # Barra de ferramentas flutuante de edição
│   ├── ZoomControl.tsx        # Controle de zoom do mapa
│   ├── MiniMap.tsx            # Mini-mapa de navegação
│   ├── LayersPanel.tsx        # Painel de visibilidade/bloqueio de camadas
│   ├── InspectorPanel.tsx     # Painel de edição de elementos selecionados
│   ├── TravelPlanner.tsx      # Simulador de viagem e gestão de caravana
│   ├── CampaignSelector.tsx   # Seletor/gerenciador de campanhas
│   └── CommandPalette.tsx     # Busca rápida (Cmd/Ctrl+K) por elementos do mapa
├── utils/
│   ├── datetime.ts            # Helpers de timestamp
│   └── coordinates.ts         # Conversão entre coordenadas de mapa e tela
├── types.ts                   # Tipagens (Campaign, Region, Route, POI, TravelPlan, Caravan...)
├── defaultCampaign.ts          # Campanha padrão carregada na primeira execução
├── App.tsx                    # Componente raiz e orquestração de estado
└── main.tsx                   # Ponto de entrada da aplicação

server.ts                      # Servidor Express

```

## 🚀 Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- npm

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Lucas-RCS/Traveler.git
cd Traveler

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Outros comandos disponíveis

```bash
npm run build     # Gera a build de produção (cliente + servidor)
npm run start     # Sobe o servidor Express servindo a build de produção
npm run lint       # Verifica os tipos com o TypeScript (tsc --noEmit)
```

## 📌 Roadmap

- [ ] Reconstrução do modulo de criação de regiões utilizando bibliotecas modernas
- [ ] Ajuste na mecânica de criação de Caravana, ajuste e adição de recursos
- [ ] Suporte a múltiplos jogadores em tempo real
- [ ] Testes automatizados (unitários e de integração)

## 👤 Autor

**Lucas Ribeiro**
Desenvolvedor Front-end | UI/UX Design

- GitHub: [@Lucas-RCS](https://github.com/Lucas-RCS)
- Site: [lucasribeiro.dev.br](https://lucasribeiro.dev.br)

## 📄 Licença

Este projeto está disponível para fins de estudo e portfólio.
