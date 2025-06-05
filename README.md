# ⚔️ Monster Battle Arena

Uma aplicação web moderna para criar monstros personalizados e simular batalhas! Desenvolvida em React + TypeScript com Material-UI.

## 🌟 Funcionalidades

- **Criação de Monstros**: Formulário intuitivo para criar monstros com atributos customizáveis
- **Sistema de Batalha**: Combates automáticos com mecânicas de crítico e esquiva
- **Interface Responsiva**: Design otimizado para mobile e desktop
- **Batalhas Animadas**: Visualização em tempo real dos rounds de combate
- **Histórico**: Acompanhe as últimas 5 batalhas realizadas
- **Monstros Pré-definidos**: 5 monstros de exemplo com imagens e balanceamento testado

## 🛠️ Tecnologias Utilizadas

- **React 19.1.0** - Biblioteca para interface de usuário
- **TypeScript 4.9.5** - Linguagem com tipagem estática
- **Material-UI 7.1.1** - Biblioteca de componentes UI
- **Emotion** - CSS-in-JS para estilização
- **UUID** - Geração de IDs únicos

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** (versão 16.x ou superior)
- **npm** (versão 8.x ou superior) ou **yarn**

### Verificar versões instaladas:

```bash
node --version
npm --version
```

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/monster-battle.git
cd monster-battle
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

### 3. Execute o projeto em modo desenvolvimento

```bash
npm start
```

ou

```bash
yarn start
```

### 4. Acesse no navegador

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

A página será recarregada automaticamente quando você fizer alterações no código.

## 📦 Build para Produção

### 1. Gerar build otimizado

```bash
npm run build
```

### 2. Servir localmente (opcional)

```bash
# Instalar serve globalmente (uma vez)
npm install -g serve

# Servir o build
serve -s build
```

O build otimizado estará na pasta `build/` e estará pronto para deploy.

## 🎮 Como Usar

### 1. **Carregar Monstros de Exemplo**

- Clique em "🎲 Carregar Exemplos" para adicionar 5 monstros pré-configurados

### 2. **Criar Monstro Personalizado**

- Preencha o formulário com:
  - Nome do monstro
  - URL da imagem (opcional)
  - Atributos: Ataque, Defesa, Velocidade, HP
- O poder total é calculado automaticamente
- Clique em "CRIAR MONSTRO"

### 3. **Iniciar Batalha**

- Clique em qualquer **2 monstros** para selecioná-los
- A batalha iniciará automaticamente
- Escolha entre "Batalha Instantânea" ou "Batalha Animada"

### 4. **Acompanhar Resultado**

- Veja o round-by-round da batalha
- Observe críticos, esquivas e danos
- Confira o histórico de batalhas na parte inferior

## ⚙️ Sistema de Combate

### **Mecânicas de Batalha:**

- **Dano**: `Ataque - Defesa` (mínimo 1)
- **Crítico**: 5% base + velocidade/1000 (máximo 25%) = 1.8x dano
- **Esquiva**: velocidade/500 (máximo 20%) = evita completamente o dano
- **Turnos**: Determinados pela velocidade (maior velocidade ataca primeiro)

### **Exemplo de Combate:**

```
Dragão Vermelho (ATK 50, DEF 30, SPD 65, HP 125)
vs
Golem de Pedra (ATK 40, DEF 50, SPD 25, HP 150)

Dragão ataca: 50 - 50 = 1 dano (mínimo)
Golem ataca: 40 - 30 = 10 dano
```

## 📱 Design Responsivo

- **Mobile**: Rolagem horizontal mostrando 2 cards por vez
- **Tablet**: Grid adaptativo com cards maiores
- **Desktop**: Grid completo com múltiplas colunas

## 🔧 Scripts Disponíveis

- `npm start` - Executa em modo desenvolvimento
- `npm run build` - Gera build para produção
- `npm test` - Executa testes (se configurados)
- `npm run eject` - Remove dependência do Create React App ⚠️

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── MonsterCard/     # Card de exibição do monstro
│   ├── MonsterForm/     # Formulário de criação
│   └── BattleArena/     # Arena de batalha
├── data/               # Dados estáticos
│   └── sampleMonsters.ts # Monstros de exemplo
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
├── utils/              # Utilitários
│   └── battleEngine.ts # Motor de batalha
├── App.tsx             # Componente principal
└── index.tsx           # Ponto de entrada
```

## 🎨 Customização

### **Adicionar Novos Monstros:**

Edite `src/data/sampleMonsters.ts`:

```typescript
{
  id: uuidv4(),
  name: "Novo Monstro",
  attack: 45,
  defense: 35,
  speed: 55,
  hp: 120,
  image_url: "/path/to/image.jpg"
}
```

### **Ajustar Balanceamento:**

Modifique as fórmulas em `src/utils/battleEngine.ts`:

- `calculateDamage()` - Cálculo de dano
- `calculateCriticalHit()` - Taxa de crítico
- `calculateDodge()` - Taxa de esquiva

## 🐛 Solução de Problemas

### **Erro de Dependências:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### **Porta 3000 Ocupada:**

```bash
npm start -- --port 3001
```

### **Build com Warnings:**

Warnings de ESLint são normais e não afetam o funcionamento.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para o desafio técnico da Revi.

---

**Divirta-se criando e batalhas épicas com seus monstros! ⚔️🔥**
