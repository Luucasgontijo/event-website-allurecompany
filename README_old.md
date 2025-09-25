# 🚀 Allure Music Hall - Sistema de Administração de Eventos (React)

Sistema moderno e profissional para administração e cadastro de eventos da Allure Music Hall, desenvolvido com **React**, **TypeScript**, **Tailwind CSS** e integração com **Google Sheets**.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação Robusto
- **JWT-like tokens** com validação e expiração
- **Múltiplos usuários** com diferentes roles
- **Cookies seguros** com proteção CSRF
- **Loading states** e feedback visual
- **Validação completa** com react-hook-form + zod

## 🔑 Credenciais de Acesso

### Administrador Principal
- **E-mail**: `Allure@mangoia.com.br`
- **Senha**: `AllureMusic2025!`

### Gerente (usuário adicional)
- **E-mail**: `manager@allure.com.br`  
- **Senha**: `AllureManager2025!`

## 🚦 Como Executar

```bash
# 1. Instalar dependências
cd allure-events-react
npm install

# 2. Configurar variáveis (opcional)
cp .env.example .env.local
# Editar VITE_GOOGLE_SCRIPT_URL se necessário

# 3. Executar em desenvolvimento
npm run dev

# 4. Acessar http://localhost:5173
```

## 🎯 Principais Melhorias

### Interface de Login
- ✅ Logo bem posicionado (não colado)
- ✅ Botão com estilo Allure personalizado
- ✅ Sem elementos bugados embaixo
- ✅ Layout justify-evenly perfeito

### Formulário de Eventos  
- ✅ Endereço padrão configurado com botão
- ✅ Campo de descrição do evento
- ✅ Status personalizado condicional
- ✅ Placeholders com cor mais clara
- ✅ Selects customizados (não padrão do navegador)

### Sistema de Ingressos
- ✅ Interface limpa sem linhas vazias
- ✅ Componentes totalmente customizados
- ✅ Responsividade perfeita
- ✅ Validação robusta
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
