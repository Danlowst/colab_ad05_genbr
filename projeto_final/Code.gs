// Código do Google Apps Script (cole em Extensões > Apps Script, dentro da planilha).
// A planilha precisa ter na linha 1 os cabeçalhos: Data | Nome | Email

// Função executada quando o script recebe uma requisição HTTP POST.
// Ela recebe um JSON enviado pelo Python, extrai os campos 'nome' e 'email',
// e adiciona uma nova linha na planilha com a data atual.
function doPost(e) {
  // Obtém a planilha ativa do Google Sheets.
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Lê o corpo da requisição como texto JSON e converte para objeto JavaScript.
  var dados = JSON.parse(e.postData.contents);

  // Adiciona uma nova linha na planilha:
  // coluna 1 = data/hora atual, coluna 2 = nome, coluna 3 = email
  planilha.appendRow([new Date(), dados.nome, dados.email]);

  // Responde ao cliente com uma mensagem de sucesso.
  return ContentService.createTextOutput("Sucesso");
}

// Função executada quando o script recebe uma requisição HTTP GET.
// Ela lê todos os dados da planilha e devolve em formato JSON, usando a
// primeira linha como nomes das chaves dos objetos.
function doGet(e) {
  // Obtém a planilha ativa do Google Sheets.
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Pega todas as linhas da planilha em formato de matriz.
  var linhas = planilha.getDataRange().getValues();

  // Remove a primeira linha (cabeçalhos) e guarda em uma variável.
  var cabecalhos = linhas.shift();

  // Converte cada linha em um objeto JavaScript, usando os cabeçalhos como chaves.
  var json = linhas.map(linha => {
    var objeto = {};

    // Para cada cabeçalho, atribui o valor correspondente da linha.
    cabecalhos.forEach((cabecalho, i) => objeto[cabecalho] = linha[i]);

    return objeto;
  });

  // Retorna os dados em JSON para o cliente.
  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
}
