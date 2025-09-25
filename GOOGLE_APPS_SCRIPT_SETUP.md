# 📋 Configurações do Google Apps Script

## 🔧 Passo 1: Configurar o Script

1. **Abra o Google Apps Script**: https://script.google.com/
2. **Crie um novo projeto** chamado "Allure Events Backend"
3. **Cole o código** do arquivo `google-apps-script.js`
4. **Configure as variáveis**:
   ```javascript
   const SHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI'; // Pegar da URL do Google Sheets
   const SHEET_NAME = 'Planilha1'; // Nome da aba da planilha
   ```

## 📊 Passo 2: Preparar a Planilha

1. **Crie uma nova planilha** no Google Sheets
2. **Configure os cabeçalhos** na primeira linha (A1 até J1):
   ```
   ID do Evento | Nome do Evento | Artista/Organizador | Data e Horário | Status | Endereço | Descrição | INGRESSOS (JSON) | DATA DE CADASTRO | USUÁRIO
   ```

3. **Copie o ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```

## 🚀 Passo 3: Deploy do Script

1. **No Apps Script**, clique em "Implantar" > "Nova implantação"
2. **Tipo**: Escolha "Aplicativo da web"
3. **Descrição**: "Allure Events API"
4. **Executar como**: "Eu"
5. **Quem tem acesso**: "Qualquer pessoa"
6. **Clique em "Implantar"**
7. **Copie a URL** gerada (algo como: `https://script.google.com/macros/s/ABC123/exec`)

## ⚙️ Passo 4: Configurar Frontend

### Para desenvolvimento local:
1. **Crie arquivo** `.env.local`:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID_AQUI/exec
   ```

### Para produção:
1. **Crie arquivo** `.env.production`:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID_AQUI/exec
   ```

## 🧪 Passo 5: Testar

1. **No Google Apps Script**, execute a função `testScript()`
2. **Verifique** se uma linha de teste foi adicionada na planilha
3. **Teste o frontend** preenchendo o formulário

## 🔒 Passo 6: Configurar Permissões

1. **No Google Apps Script**, vá em "Gatilhos"
2. **Adicione um gatilho** para a função `doPost`
3. **Autorize** as permissões necessárias

## 📱 URLs Importantes

- **Google Apps Script**: https://script.google.com/
- **Google Sheets**: https://sheets.google.com/
- **Sua planilha**: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`
- **Seu script**: `https://script.google.com/macros/s/SEU_ID_AQUI/exec`

## 🔧 Troubleshooting

### Erro: "Script function not found"
- Verifique se o nome das funções está correto
- Certifique-se que salvou o script

### Erro: "Permission denied"
- Execute `testScript()` no Apps Script primeiro
- Autorize todas as permissões solicitadas

### Erro: "CORS"
- Certifique-se que a função `doOptions()` está implementada
- Verifique os cabeçalhos CORS nas respostas

### Dados não aparecem na planilha
- Verifique o SHEET_ID e SHEET_NAME
- Execute `verificarConfiguracao()` para testar conexão
- Verifique os logs no Apps Script (Ctrl+Enter)

## 📋 Checklist Final

- [ ] Script implantado no Google Apps Script
- [ ] SHEET_ID configurado corretamente
- [ ] Planilha com cabeçalhos corretos
- [ ] URL do script configurada no frontend
- [ ] Teste executado com sucesso
- [ ] Permissões autorizadas
- [ ] CORS funcionando (testado do navegador)

---

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique os logs** no Google Apps Script
2. **Teste as funções** individualmente no Apps Script
3. **Verifique o console** do navegador para erros
4. **Confirme as permissões** da planilha e script