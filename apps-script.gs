/**
 * Fonil Quiz Diagnóstico — Google Apps Script Webhook
 *
 * Como usar:
 * 1. Crie uma planilha no Google Sheets (ou use uma existente)
 * 2. Clique em Extensões > Apps Script
 * 3. Apague o conteúdo e cole todo este código
 * 4. Salve com Ctrl+S
 * 5. Clique em Implantar > Nova implantação
 *    - Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 6. Clique em Implantar e autorize as permissões
 * 7. Copie o URL do app da web e cole em .env.local como GOOGLE_SHEETS_WEBHOOK_URL
 */

var SHEET_NAME = 'Leads Fonil Quiz';

// Nome do atendente que vai receber os leads (aparece na mensagem do link de WhatsApp)
var NOME_ATENDENTE = 'Heitor';

var HEADERS = [
  'Data/Hora',
  'Nome Completo',
  'Primeiro Nome',
  'Empresa',
  'WhatsApp',          // link clicável com mensagem pronta
  'WhatsApp Limpo',
  'E-mail',
  'CNPJ',
  'CNPJ Limpo',
  'Cidade',
  'Estado',
  'Cargo',
  'Tipo Operação',
  'Segmento',
  'Público Atendido',
  'Faturamento',
  'Uso WhatsApp',
  'Tamanho Comercial',
  'Origem Clientes',
  'Investimento Marketing',
  'Rastreio Vendas',
  'Recompra',
  'Capacidade Atendimento',
  'Objetivo Principal',
  'Resultado Diagnóstico',
  'Nível Qualificação',
  'Event ID',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Content',
  'UTM Term',
  'FBC',
  'FBP',
  'URL Página',
  'Dispositivo',
  'Navegador'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    if (sheet.getLastRow() === 0) {
      setupSheet(sheet);
    }

    var waColIndex   = HEADERS.indexOf('WhatsApp') + 1;
    var emailColIndex = HEADERS.indexOf('E-mail') + 1;

    // Monta a mensagem de abordagem que o Heitor vai enviar ao lead
    var firstName    = data.primeiro_nome || data.nome_completo || 'cliente';
    var mensagem     = 'Olá ' + firstName + '! Me chamo ' + NOME_ATENDENTE + ', e vou continuar seu atendimento por aqui!';
    var telefone     = (data.whatsapp_limpo || '').replace(/\D/g, '');

    // Garante o código do país (55) no início
    if (telefone && !telefone.startsWith('55')) {
      telefone = '55' + telefone;
    }

    var row = [
      data.timestamp || Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss'),
      data.nome_completo           || '',
      data.primeiro_nome           || '',
      data.empresa                 || '',
      data.whatsapp                || '',   // será substituído por HYPERLINK abaixo
      data.whatsapp_limpo          || '',
      data.email                   || '',
      data.cnpj                    || '',
      data.cnpj_limpo              || '',
      data.cidade                  || '',
      data.estado                  || '',
      data.cargo                   || '',
      data.tipo_operacao           || '',
      data.segmento                || '',
      data.publico_atendido        || '',
      data.faturamento             || '',
      data.uso_whatsapp            || '',
      data.tamanho_comercial       || '',
      data.origem_clientes         || '',
      data.investimento_marketing  || '',
      data.rastreio_vendas         || '',
      data.recompra                || '',
      data.capacidade_atendimento  || '',
      data.objetivo_principal      || '',
      data.resultado_diagnostico   || '',
      data.nivel_qualificacao      || '',
      data.event_id                || '',
      data.utm_source              || '',
      data.utm_medium              || '',
      data.utm_campaign            || '',
      data.utm_content             || '',
      data.utm_term                || '',
      data.fbc                     || '',
      data.fbp                     || '',
      data.url_pagina              || '',
      data.dispositivo             || '',
      data.navegador               || ''
    ];

    // Insere nova linha logo abaixo do cabeçalho — lead mais nova sempre no topo
    sheet.insertRowAfter(1);
    var newRow = 2;
    sheet.getRange(newRow, 1, 1, row.length).setValues([row]);

    // ──────────────────────────────────────────────────────────────────
    // WhatsApp clicável: abre conversa com mensagem pronta para enviar
    // ──────────────────────────────────────────────────────────────────
    if (telefone) {
      var waUrl   = 'https://wa.me/' + telefone + '?text=' + encodeURIComponent(mensagem);
      var waLabel = data.whatsapp || telefone;
      var waCell  = sheet.getRange(newRow, waColIndex);
      waCell.setFormula('=HYPERLINK("' + waUrl + '","' + waLabel.replace(/"/g, "'") + '")');
      waCell.setFontColor('#25D366');
      waCell.setFontWeight('bold');
      waCell.setFontLine('underline');
    }

    // E-mail clicável
    if (data.email) {
      var emailCell = sheet.getRange(newRow, emailColIndex);
      emailCell.setFormula('=HYPERLINK("mailto:' + data.email + '","' + data.email + '")');
      emailCell.setFontColor('#4D9FFF');
    }

    // Destaque visual: linha 2 sempre com cor de "novo lead"
    sheet.getRange(newRow, 1, 1, HEADERS.length).setBackground('#1A2B00');
    sheet.getRange(newRow, 1, 1, HEADERS.length).setFontColor('#FFFFFF');

    // Reaplica cores nos campos especiais
    if (telefone) {
      sheet.getRange(newRow, waColIndex).setFontColor('#25D366');
    }
    if (data.email) {
      sheet.getRange(newRow, emailColIndex).setFontColor('#4D9FFF');
    }

    // Colorir célula de resultado
    var resultColIndex = HEADERS.indexOf('Resultado Diagnóstico') + 1;
    colorizeResult(sheet.getRange(newRow, resultColIndex), data.resultado_diagnostico);

    // Colorir nível de qualificação
    var qualColIndex = HEADERS.indexOf('Nível Qualificação') + 1;
    colorizeQualification(sheet.getRange(newRow, qualColIndex), data.resultado_diagnostico);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, row: newRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Erro no webhook: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var count = 0;
  try {
    var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (s) count = Math.max(0, s.getLastRow() - 1);
  } catch (err) {}
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Fonil Quiz Webhook ativo', leads: count }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    ss.setActiveSheet(sheet);
    ss.moveActiveSheet(1);
  }
  return sheet;
}

function setupSheet(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  var hr = sheet.getRange(1, 1, 1, HEADERS.length);
  hr.setBackground('#0D0D0D');
  hr.setFontColor('#C5FF4D');
  hr.setFontWeight('bold');
  hr.setFontSize(11);
  hr.setHorizontalAlignment('center');
  hr.setVerticalAlignment('middle');
  hr.setWrap(false);
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  var widths = [
    145, // Data/Hora
    170, // Nome Completo
    130, // Primeiro Nome
    170, // Empresa
    180, // WhatsApp (link)
    140, // WhatsApp Limpo
    210, // E-mail
    160, // CNPJ
    140, // CNPJ Limpo
    130, // Cidade
    80,  // Estado
    160, // Cargo
    170, // Tipo Operação
    170, // Segmento
    190, // Público Atendido
    170, // Faturamento
    230, // Uso WhatsApp
    170, // Tamanho Comercial
    190, // Origem Clientes
    210, // Investimento Marketing
    170, // Rastreio Vendas
    170, // Recompra
    210, // Capacidade Atendimento
    210, // Objetivo Principal
    190, // Resultado Diagnóstico
    260, // Nível Qualificação
    180, // Event ID
    130, // UTM Source
    130, // UTM Medium
    170, // UTM Campaign
    140, // UTM Content
    130, // UTM Term
    220, // FBC
    220, // FBP
    260, // URL Página
    110, // Dispositivo
    220  // Navegador
  ];

  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }

  sheet.setTabColor('#C5FF4D');

  try {
    SpreadsheetApp.getActiveSpreadsheet().rename('Fonil — Quiz Diagnóstico de Crescimento');
  } catch (err) {}
}

function colorizeResult(cell, result) {
  var styles = {
    'beginning': { bg: '#FF9F4D', text: '#000000' },
    'potential':  { bg: '#4D9FFF', text: '#000000' },
    'ready':      { bg: '#C5FF4D', text: '#000000' },
    'scale':      { bg: '#7FFF00', text: '#000000' }
  };
  var s = styles[result];
  if (s) {
    cell.setBackground(s.bg);
    cell.setFontColor(s.text);
    cell.setFontWeight('bold');
    cell.setHorizontalAlignment('center');
  }
}

function colorizeQualification(cell, result) {
  var styles = {
    'beginning': { bg: '#3D2000', text: '#FF9F4D' },
    'potential':  { bg: '#001A3D', text: '#4D9FFF' },
    'ready':      { bg: '#1A2B00', text: '#C5FF4D' },
    'scale':      { bg: '#0A1F00', text: '#7FFF00' }
  };
  var s = styles[result];
  if (s) {
    cell.setBackground(s.bg);
    cell.setFontColor(s.text);
    cell.setFontWeight('bold');
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Teste local — rode no editor do Apps Script para validar antes de produção
// ──────────────────────────────────────────────────────────────────────────────
function testWebhook() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nome_completo: 'Miguel Sousa Teste',
        primeiro_nome: 'Miguel',
        empresa: 'Distribuidora Teste Ltda',
        whatsapp: '(86) 99531-5620',
        whatsapp_limpo: '86995315620',
        email: 'miguel@teste.com.br',
        cnpj: '12.345.678/0001-90',
        cnpj_limpo: '12345678000190',
        cidade: 'Teresina',
        estado: 'PI',
        cargo: 'Sócio / Dono',
        tipo_operacao: 'distribuidora',
        segmento: 'alimentos_bebidas',
        publico_atendido: 'lojistas',
        faturamento: 'above_1m',
        uso_whatsapp: 'main_channel',
        tamanho_comercial: '4_6',
        origem_clientes: 'referral',
        investimento_marketing: 'yes_dont_know',
        rastreio_vendas: 'partially',
        recompra: 'sometimes',
        capacidade_atendimento: 'yes_need_organize',
        objetivo_principal: 'new_predictable_channel',
        resultado_diagnostico: 'scale',
        nivel_qualificacao: 'ICP Quente - Pronta para Escalar',
        event_id: '1234567890-abcdefghi',
        utm_source: 'instagram',
        utm_medium: 'cpc',
        utm_campaign: 'quiz_diagnostico',
        url_pagina: 'https://quiz.fonilcompany.com.br',
        dispositivo: 'mobile',
        navegador: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)'
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
