# 🚀 SOLUÇÃO RÁPIDA - Sem Apps Script

Se você está tendo problemas com o Google Apps Script, use esta alternativa simples:

## ✅ **Método Mais Simples**

### **1. Configurar apenas a planilha**

1. **Crie** Google Sheets: "Allure Events Database"
2. **Adicione cabeçalhos**:
```
A1: ID | B1: Nome | C1: Artista | D1: Data/Hora | E1: Status 
F1: Endereço | G1: Descrição | H1: Ingressos | I1: Cadastro | J1: Usuário
```

### **2. Usar modo simulação**

1. **NÃO configure** o arquivo `.env`
2. **Deixe** a variável `VITE_GOOGLE_SCRIPT_URL` vazia
3. **O sistema funcionará** em modo simulação

### **3. Como usar**

1. **Preencha** o formulário normalmente
2. **Cadastre** o evento
3. **Abra console** do navegador (F12)
4. **Copie os dados** formatados que aparecem no console
5. **Cole manualmente** na planilha

### **4. Exemplo de dados no console:**

```json
{
  "nome": "Show de Jazz",
  "artista": "João Silva & Banda", 
  "data": "2025-09-24 das 20:00 às 23:00 (GMT-4)",
  "status": "disponível",
  "endereco": "Rodovia Arquiteto Helder...",
  "descricao": "Noite especial de jazz",
  "ingressos": "VIP (camarote_premium) - R$ 150,00 - Qtd: 100",
  "data_cadastro": "24/09/2025 15:30:45",
  "usuario": "Administrador Allure"
}
```

---

## 🔄 **Upgrade futuro**

Quando quiser automatizar 100%, você pode:
1. **Tentar** Apps Script novamente mais tarde
2. **Usar** webhook services como Zapier/Make
3. **Implementar** API própria

---

## ✨ **Vantagens desta solução:**

- ✅ **Funciona imediatamente** 
- ✅ **Sem configuração complexa**
- ✅ **Dados bem formatados**
- ✅ **Fácil de copiar/colar**
- ✅ **Sem erros 400**

**Por enquanto, você tem um sistema totalmente funcional!** 🎉