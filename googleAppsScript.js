// Ganti dengan ID Spreadsheet Anda. Anda bisa mendapatkannya dari URL spreadsheet.
// Contoh: https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
const SPREADSHEET_ID = "1BowBvDPsgFdqeE5QOb9wcggrgDslP-MGOUt5su1-cnQ";

// --- SHEET ACCESSOR FUNCTIONS (Lazy Loading) ---
function getSheet(name) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet with name "${name}" not found.`);
  }
  return sheet;
}

// --- UTILITY FUNCTIONS ---

/**
 * Handles responses.
 * @param {object} data - The data to be returned as JSON.
 * @returns {GoogleAppsScript.Content.TextOutput} - The content service response.
 */
function handleResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Converts a sheet's data into an array of JSON objects.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to convert.
 * @returns {Array<Object>} - An array of objects representing rows.
 */
function sheetToJSON(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data.shift().map(h => h.toString().trim());
  return data.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      if(header) { // Only process if header is not empty
        const isNumericHeader = ['quantity', 'minStock', 'amount', 'stockIn', 'stockOut'].includes(header);
        // Important: Read the calculated value from the formula, don't try to parse the formula itself.
        obj[header] = isNumericHeader && row[i] !== '' && !isNaN(parseFloat(row[i])) ? parseFloat(row[i]) : row[i];
      }
    });
    return obj;
  });
}

/**
 * Appends a JavaScript object as a new row in a sheet, matching properties to headers.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The target sheet.
 * @param {Object} obj - The object to append.
 */
function appendObjectAsRow(sheet, obj) {
  if (!sheet) throw new Error("Sheet not found.");
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => obj.hasOwnProperty(header) ? obj[header] : null);
  sheet.appendRow(row);
}

/**
 * Finds a row in a sheet by its ID.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to search in.
 * @param {string} id - The ID of the row to find.
 * @returns {{rowIndex: number, headers: Array<string>, rowData: Object}|null} - The row index, headers, row data, or null if not found.
 */
function findRowById(sheet, id) {
    if (!sheet) return null;
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColIndex = headers.indexOf('id');
    if (idColIndex === -1) return null;

    for (let i = 1; i < data.length; i++) {
        if (data[i][idColIndex] && data[i][idColIndex].toString() === id.toString()) {
            const rowData = {};
            headers.forEach((header, j) => {
              rowData[header] = data[i][j];
            });
            return {
                rowIndex: i + 1, // 1-based index for getRange
                headers: headers,
                rowData: rowData
            };
        }
    }
    return null;
}


// --- ROUTER FUNCTIONS (doGet, doPost, doOptions) ---

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'getData') {
      return handleResponse(getAllData());
    }
    return handleResponse({ error: "Invalid GET action" });
  } catch (error) {
    Logger.log(`GET Error: ${error.message}\nStack: ${error.stack}`);
    return handleResponse({ error: `Server error: ${error.message}` });
  }
}

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    Logger.log(`Received POST action: ${requestData.action} with payload: ${JSON.stringify(requestData.payload)}`);
    const action = requestData.action;

    switch (action) {
      case 'login': return handleResponse(loginUser(requestData.payload));
      case 'getUsers': return handleResponse(getUsers());
      case 'addUser': return handleResponse(addUser(requestData.payload));
      case 'addNewItem': return handleResponse(addNewItem(requestData.payload));
      case 'editItem': return handleResponse(editItem(requestData.payload));
      case 'addTransaction': return handleResponse(addTransaction(requestData.payload));
      default: return handleResponse({ error: "Invalid POST action" });
    }
  } catch (error) {
    Logger.log(`POST Error: ${error.message}\nStack: ${error.stack}`);
    return handleResponse({ error: `Server error: ${error.message}` });
  }
}

/**
 * Handles CORS preflight requests. This is crucial for the browser to allow the POST request.
 */
function doOptions(e) {
  return ContentService.createTextOutput()
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}


// --- CORE LOGIC FUNCTIONS ---

function getAllData() {
  const stockSheet = getSheet("Stock");
  const transactionsSheet = getSheet("Transactions");
  const stock = sheetToJSON(stockSheet);
  const transactions = sheetToJSON(transactionsSheet).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return { stock, transactions };
}

function getUsers(includePassword = false) {
  const usersSheet = getSheet("Users");
  const users = sheetToJSON(usersSheet);
  if (!includePassword) {
    return users.map(({ password, ...user }) => user);
  }
  return users;
}

function loginUser({ username, password }) {
  const usersSheet = getSheet("Users");
  const users = sheetToJSON(usersSheet);
  const user = users.find(u => u.username === username && u.password.toString() === password.toString());

  if (user) {
    const { password, ...userData } = user;
    return { success: true, user: userData };
  } else {
    return { success: false, message: "Username atau password salah." };
  }
}

function addUser({ username, password, role }) {
  const usersSheet = getSheet("Users");
  if (!username || !password || !role) throw new Error("Missing required fields for new user.");
  const existingUser = sheetToJSON(usersSheet).find(u => u.username === username);
  if (existingUser) throw new Error("Username sudah ada.");

  appendObjectAsRow(usersSheet, { username, password, role });
  return { success: true, user: { username, role } };
}

function addNewItem(item) {
  // Quantity is no longer handled here. It's calculated by the sheet formula.
  const stockSheet = getSheet("Stock");
  appendObjectAsRow(stockSheet, item);
  return { success: true, item };
}

function addTransaction(tx) {
  const transactionsSheet = getSheet("Transactions");
  appendObjectAsRow(transactionsSheet, tx);
  return { success: true, transaction: tx };
}

function editItem(item) {
  const stockSheet = getSheet("Stock");
  // Note: 'quantity' is not editable from the app.
  const { id, name, unit, minStock, stockType } = item;
  const found = findRowById(stockSheet, id);

  if (found) {
    const nameColIndex = found.headers.indexOf('name');
    const unitColIndex = found.headers.indexOf('unit');
    const minStockColIndex = found.headers.indexOf('minStock');
    const stockTypeColIndex = found.headers.indexOf('stockType');

    if (nameColIndex > -1) stockSheet.getRange(found.rowIndex, nameColIndex + 1).setValue(name);
    if (unitColIndex > -1) stockSheet.getRange(found.rowIndex, unitColIndex + 1).setValue(unit);
    if (minStockColIndex > -1) stockSheet.getRange(found.rowIndex, minStockColIndex + 1).setValue(minStock);
    if (stockTypeColIndex > -1) stockSheet.getRange(found.rowIndex, stockTypeColIndex + 1).setValue(stockType);

    return { success: true, item };
  }
  throw new Error("Item not found for editing.");
}
