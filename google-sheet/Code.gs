/**
 * 午睡空間｜表單寫入 Google 試算表
 *
 * 綁定在試算表的 Apps Script。網站的預約表單與聯絡表單都會 POST 到這裡，
 * 依 kind 欄位分別寫進「預約」與「聯絡」兩個工作表，並寄一封通知信給經營者。
 *
 * 部署方式見同資料夾的「設定步驟.md」。
 */

// 收到新資料時要通知的信箱。留空字串就不寄信。
var NOTIFY_EMAIL = 'qiaoweixie@gmail.com';

// 兩種表單各自的工作表名稱與欄位順序。欄位名稱要和 index.html 表單的 name 一致。
var SHEETS = {
  booking: {
    name: '預約',
    columns: [
      ['time', '送出時間'],
      ['name', '稱呼'],
      ['contact', '聯絡方式'],
      ['location', '地點'],
      ['date', '希望日期'],
      ['slot', '希望時段'],
      ['note', '備註'],
      ['status', '處理狀態'],
      ['page', '來源頁面']
    ]
  },
  contact: {
    name: '聯絡',
    columns: [
      ['time', '送出時間'],
      ['name', '稱呼'],
      ['contact', '聯絡方式'],
      ['topic', '主題'],
      ['message', '內容'],
      ['status', '處理狀態'],
      ['page', '來源頁面']
    ]
  }
};

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var config = SHEETS[p.kind];
    if (!config) return respond({ result: 'error', message: 'unknown kind' });
    if (!p.name || !p.contact) return respond({ result: 'error', message: 'missing fields' });

    var sheet = getSheet(config);
    var now = new Date();
    var row = config.columns.map(function (col) {
      var key = col[0];
      if (key === 'time') return now;
      if (key === 'status') return '待處理';
      return (p[key] || '').toString().slice(0, 2000);
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) notify(config, p, now);
    return respond({ result: 'ok' });
  } catch (err) {
    return respond({ result: 'error', message: String(err) });
  }
}

// 讓瀏覽器直接開啟網址時看得到服務有在跑
function doGet() {
  return respond({ result: 'ok', message: '午睡空間表單服務運作中' });
}

function getSheet(config) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }
  if (sheet.getLastRow() === 0) {
    var headers = config.columns.map(function (col) { return col[1]; });
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  }
  return sheet;
}

function notify(config, p, now) {
  var subject = '午睡空間｜新的' + config.name + '：' + p.name;
  var lines = config.columns
    .filter(function (col) { return col[0] !== 'time' && col[0] !== 'status' && col[0] !== 'page'; })
    .map(function (col) { return col[1] + '：' + (p[col[0]] || ''); });
  lines.unshift('送出時間：' + Utilities.formatDate(now, 'Asia/Taipei', 'yyyy-MM-dd HH:mm'));
  lines.push('');
  lines.push('試算表：' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n'));
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
