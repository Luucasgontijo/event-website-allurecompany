/**
 * Google Apps Script para integração com Allure Music Hall
 * Este script recebe dados do formulário React e adiciona à planilha
 */

// ID da planilha (pegar da URL do Google Sheets)
const SHEET_ID = '13eLsjnroLiwKxVzZpxYLJ6_4_I0d2upCMRE1m4NqDH8'; // Substituir pelo ID real
const SHEET_NAME = 'eventos'; // ou 'Sheet1' - verificar nome da aba na planilha

// Verificação de configuração
function verificarConfiguracao() {
  if (SHEET_ID === 'SEU_SHEET_ID_AQUI') {
    throw new Error('SHEET_ID não foi configurado! Substitua SEU_SHEET_ID_AQUI pelo ID real da planilha');
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Aba '${SHEET_NAME}' não encontrada. Verifique o nome da aba na planilha.`);
    }
    return sheet;
  } catch (error) {
    throw new Error(`Erro ao acessar planilha: ${error.message}`);
  }
}

/**
 * Função principal que recebe os dados via POST
 */
function doPost(e) {
  try {
    console.log('📥 Requisição recebida no Apps Script');
    console.log('🔍 Objeto e:', e ? 'existe' : 'null');
    console.log('🔍 PostData:', e?.postData ? 'existe' : 'null');
    console.log('🔍 Contents:', e?.postData?.contents || 'vazio');
    
    // Verificar configuração primeiro
    verificarConfiguracao();
    
    // Verificar se há dados
    if (!e || !e.postData || !e.postData.contents) {
      console.log('❌ Nenhum dado recebido - detalhes:');
      console.log('- e existe?', !!e);
      console.log('- postData existe?', !!(e?.postData));
      console.log('- contents existe?', !!(e?.postData?.contents));
      
      throw new Error('Nenhum dado recebido na requisição');
    }
    
    // Parse dos dados recebidos
    const rawData = e.postData.contents;
    console.log('📄 Dados brutos recebidos:', rawData);
    
    const data = JSON.parse(rawData);
    console.log('✅ Dados parseados com sucesso:', data);
    
    // Adicionar linha na planilha
    const result = addRowToSheet(data);
    
    // Resposta de sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Evento cadastrado com sucesso!',
        rowId: result.rowId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erro ao processar dados:', error);
    
    // Resposta de erro
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro interno do servidor',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para tratar requisições OPTIONS (CORS)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Adiciona uma nova linha na planilha
 */
function addRowToSheet(eventData) {
  try {
    console.log('📊 Adicionando dados à planilha:', eventData);
    
    // Verificar e abrir a planilha
    const sheet = verificarConfiguracao();
    
    // Gerar ID único
    const eventId = 'EVT_' + new Date().getTime();
    
    // Formatar data (já vem no formato dd-mm-aaaa)
    const dataFormatada = eventData.data;
    
    // Formatar horários (já vem no formato 24h)
    const horaInicioFormatada = eventData.horaInicio;
    const horaTerminoFormatada = eventData.horaTermino || '';
    
    // Processar nova estrutura de ingressos JSON
    const ingressosJSON = JSON.stringify(eventData.ingressos || {});
    
    // Criar uma string legível dos ingressos para visualização
    let ingressosTexto = '';
    if (eventData.ingressos && typeof eventData.ingressos === 'object') {
      const categorias = Object.keys(eventData.ingressos);
      ingressosTexto = categorias.map(categoria => {
        const tickets = eventData.ingressos[categoria] || [];
        if (tickets.length === 0) return null;
        
        const categoriaNome = categoria.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const ticketsTexto = tickets.map(ticket => 
          `${ticket.nome} - R$ ${ticket.preco ? ticket.preco.toFixed(2) : '0,00'}${ticket.descricao ? ` (${ticket.descricao})` : ''}`
        ).join(' | ');
        
        return `${categoriaNome.toUpperCase()}: ${ticketsTexto}`;
      }).filter(Boolean).join('\n');
    }
    
    if (!ingressosTexto) {
      ingressosTexto = 'Nenhum ingresso cadastrado';
    }
    
    // Preparar dados para inserir - ajustado para corresponder aos cabeçalhos existentes
    const rowData = [
      eventId,                          // A: ID do Evento
      eventData.nome || '',             // B: Nome do Evento
      eventData.artista || '',          // C: Artista/Organizador
      `${dataFormatada} das ${horaInicioFormatada}${horaTerminoFormatada ? ` às ${horaTerminoFormatada}` : ''} (${eventData.fusoHorario})`, // D: Data e Hora
      eventData.status === 'personalizado' ? eventData.statusPersonalizado : eventData.status, // E: Status
      eventData.endereco || '',         // F: Endereço
      eventData.descricao || '',        // G: Descrição
      ingressosJSON,                    // H: INGRESSOS (JSON) - corresponde ao cabeçalho
      new Date().toLocaleString('pt-BR'), // I: DATA DE CADASTRO - corresponde ao cabeçalho
      'Administrador Allure'            // J: USUÁRIO - corresponde ao cabeçalho
    ];
    
    console.log('📝 Dados formatados para inserção:', rowData);
    
    // Adicionar linha na planilha
    sheet.appendRow(rowData);
    
    // Aplicar formatação à nova linha
    const lastRow = sheet.getLastRow();
    formatarLinha(sheet, lastRow);
    
    console.log('✅ Linha adicionada com sucesso:', eventId);
    
    return {
      success: true,
      rowId: eventId,
      rowNumber: lastRow
    };
    
  } catch (error) {
    console.error('❌ Erro ao adicionar linha:', error);
    throw error;
  }
}



/**
 * Aplicar formatação à linha recém-adicionada
 */
function formatarLinha(sheet, rowNumber) {
  const range = sheet.getRange(rowNumber, 1, 1, 10); // Ajustado para 10 colunas
  
  // Formatação básica
  range.setFontSize(10);
  range.setVerticalAlignment('top');
  
  // Formatação condicional por coluna
  sheet.getRange(rowNumber, 1).setFontWeight('bold'); // ID
  sheet.getRange(rowNumber, 2).setFontWeight('bold'); // Nome do Evento
  sheet.getRange(rowNumber, 8).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP); // Ingressos (JSON)
}

/**
 * Função para testar apenas recebimento de dados (sem adicionar à planilha)
 */
function testReceiveData() {
  // Simular dados vindos do site
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        nomeEvento: 'Teste de Comunicação',
        artista: 'Teste Artist',
        dataEvento: '2024-01-15',
        horaInicio: '20:00',
        horaTermino: '23:00',
        fusoHorario: 'GMT-4',
        categoria: 'Show',
        categoriaPersonalizada: '',
        descricaoEvento: 'Evento de teste para verificar comunicação',
        ingressos: 'VIP: R$ 100,00 | Pista: R$ 50,00'
      })
    }
  };
  
  console.log('🧪 Testando recebimento de dados...');
  
  try {
    // Vamos apenas testar o parsing sem mexer na planilha
    if (!mockEvent.postData || !mockEvent.postData.contents) {
      throw new Error('Nenhum dado recebido na requisição');
    }
    
    const data = JSON.parse(mockEvent.postData.contents);
    console.log('✅ Dados parseados com sucesso:', data);
    
    return 'TESTE PASSOU - Dados recebidos e parseados corretamente';
  } catch (error) {
    console.log('❌ Erro no teste:', error.toString());
    return 'TESTE FALHOU: ' + error.toString();
  }
}

/**
 * Função de teste para verificar se o script está funcionando
 */
function testScript() {
  const testData = {
    nome: 'Evento Teste',
    artista: 'Artista Teste',
    data: '24-09-2025',
    horaInicio: '20:00',
    horaTermino: '23:00',
    fusoHorario: 'GMT-4',
    status: 'disponivel',
    endereco: 'Endereço teste',
    descricao: 'Descrição teste',
    ingressos: {
      setores_mesa: [
        { id: '1', nome: 'Mesa VIP', preco: 150.00, descricao: 'Mesa para 4 pessoas' }
      ],
      camarotes_premium: [
        { id: '2', nome: 'Camarote Premium', preco: 300.00, descricao: 'Camarote com vista privilegiada' }
      ]
    }
  };
  
  const result = addRowToSheet(testData);
  console.log('Teste executado:', result);
}