# 📊 Integração Google Sheets - Allure Music Hall

Este guia explica como configurar a integração completa entre o sistema de eventos e Google Sheets.

## 🎯 O que acontece quando você preenche o formulário?

1. **Preencher formulário** → Sistema valida os dados
2. **Enviar evento** → Dados são enviados para Google Apps Script
3. **Processar dados** → Apps Script formata e organiza as informações
4. **Adicionar linha** → Nova linha é criada automaticamente na planilha
5. **Confirmação** → Sistema exibe sucesso e permite novo cadastro

---

## 📋 Passo a Passo Completo

### **1. Criar Google Sheets**

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie nova planilha: **"Allure Events Database"**
3. Configure cabeçalhos na primeira linha:

```
A1: ID               | B1: Nome do Evento     | C1: Artista/Organizador
D1: Data e Horário   | E1: Status             | F1: Endereço  
G1: Descrição        | H1: Ingressos (JSON)   | I1: Data de Cadastro
J1: Usuário
```

### **2. Configurar Apps Script**

1. **Na planilha**: Extensões → Apps Script
2. **Cole o código** do arquivo `google-apps-script.js`
3. **Edite a linha 7**: Substitua `SEU_SHEET_ID_AQUI` pelo ID da sua planilha
   - URL: `https://docs.google.com/spreadsheets/d/[COPIE_ESTE_ID]/edit`
4. **Salve**: Ctrl+S → Renomeie: "Allure Events Integration"

### **3. Fazer Deploy**

1. **Clique**: "Implantar" → "Nova implantação"
2. **Tipo**: Web app
3. **Configurações**:
   - Descrição: "Allure Events API v1.0"
   - Executar como: "Eu"  
   - Acesso: "Qualquer pessoa"
4. **Implantar** → **Copiar URL** gerada

### **4. Configurar React App**

1. **Edite o arquivo** `.env`:
```bash
VITE_GOOGLE_SCRIPT_URL=SUA_URL_DO_APPS_SCRIPT_AQUI
```

2. **Reinicie o servidor**:
```bash
npm run dev
```

---

## 🆘 **SOLUÇÃO PARA ERRO "Bad Request"**

### **Se "Extensões > Apps Script" dá erro:**

**MÉTODO ALTERNATIVO:**

1. **Abra nova aba**: [script.google.com](https://script.google.com)
2. **Clique**: "Novo projeto" 
3. **Renomeie**: "Allure Events Integration"
4. **Cole o código** do arquivo `google-apps-script.js`
5. **Continue** normalmente com os passos

### **Ou use integração simplificada:**

**Se Apps Script não funcionar, ative o modo simulação:**
1. **Não configure** a variável `VITE_GOOGLE_SCRIPT_URL` no `.env`
2. **O sistema usará** modo simulação automaticamente
3. **Dados aparecerão** no console do navegador (F12)
4. **Copie manualmente** para a planilha se necessário

---

## 🧪 Como Testar

### **Teste 1: Apps Script (se funcionou)**
1. **No Apps Script**: Execute a função `testScript()`
2. **Verificar**: Nova linha deve aparecer na planilha
3. **Se não funcionou**: Verifique o SHEET_ID

### **Teste 2: Aplicação Completa**
1. **Preencha** o formulário de eventos
2. **Clique** em "Cadastrar Evento"
3. **Verificar**: 
   - Mensagem de sucesso no app
   - Nova linha na planilha do Google Sheets (se configurado)
   - Ou dados no console (modo simulação)

### **Teste 3: Modo Simulação (fallback)**
1. **Não configure** o `.env`
2. **Abra console** do navegador (F12)
3. **Cadastre evento** normalmente
4. **Veja dados** formatados no console

---

## 📊 Estrutura da Planilha

Cada evento cadastrado criará uma nova linha com:

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| **ID** | EVT_1727123456789 | ID único gerado automaticamente |
| **Nome** | Show de Jazz | Nome do evento |
| **Artista** | João Silva & Banda | Nome do artista/organizador |
| **Data/Hora** | 2025-09-24 das 20:00 às 23:00 (GMT-4) | Data e horários completos |
| **Status** | Disponível | Status atual do evento |
| **Endereço** | Rodovia Arquiteto Helder... | Endereço completo |
| **Descrição** | Noite especial de jazz... | Descrição do evento |
| **Ingressos** | VIP (R$ 150,00 - Qtd: 100)... | Lista formatada de ingressos |
| **Cadastro** | 24/09/2025 15:30:45 | Data/hora do cadastro |
| **Usuário** | Administrador Allure | Quem cadastrou |

---

## 🔧 Solução de Problemas

### **Erro: "Failed to fetch"**
- ✅ Verificar se a URL no `.env` está correta
- ✅ Certificar que o Apps Script foi implantado como "Web app"
- ✅ Verificar se o acesso está como "Qualquer pessoa"

### **Erro: "Permission denied"** 
- ✅ Executar como "Eu" no Apps Script
- ✅ Autorizar as permissões quando solicitado

### **Dados não aparecem na planilha**
- ✅ Verificar se o SHEET_ID está correto
- ✅ Verificar se o nome da aba é "Sheet1" ou alterar no script
- ✅ Executar `testScript()` para diagnóstico

### **Formato dos dados estranho**
- ✅ Verificar se os cabeçalhos estão na ordem correta
- ✅ Verificar se não há linhas vazias no meio da planilha

---

## 🚀 Recursos Avançados

### **Formatação Automática**
- IDs em negrito
- Nomes de eventos destacados
- Ingressos com quebra de linha
- Colunas com largura otimizada

### **Logs e Monitoramento**
- Todos os dados são logados no Apps Script
- Possível ver histórico de execuções
- Diagnóstico de erros facilitado

### **Segurança**
- CORS configurado corretamente
- Validação de dados no servidor
- Tratamento de erros robusto

---

## 📞 Suporte

Se precisar de ajuda:
1. **Verifique** os logs do Apps Script
2. **Teste** a função `testScript()` 
3. **Confirme** se todos os passos foram seguidos
4. **Entre em contato** para suporte técnico

---

**✅ Sistema configurado com sucesso!**
Agora cada evento cadastrado será automaticamente adicionado à sua planilha do Google Sheets! 🎉