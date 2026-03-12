/**
 * Функция записи данных об авто с расчетом стоимости 1 км и владения в месяц
 * @param {Object} carSpecs - Данные автомобиля (model, configuration, fuel_consumption, fuel_type)
 * @param {Array<Object>} mainNodes - Список крупных узлов
 * @param {Array<Object>} suspension - Элементы подвески
 * @param {Array<Object>} gsm - ГСМ
 * @param {Array<Object>} maintenance - Обслуживание
 * @param {Array<Object>} taxes - Налоги и страховки
 */
function createAutoAnalysisSheet(carSpecs, mainNodes, suspension, gsm, maintenance, taxes) {
  const ANNUAL_MILEAGE = 15000; 
  const FUEL_PRICE = 55.5;      
  
  const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  const date = Utilities.formatDate(new Date(), "GMT+3", "dd.MM HH:mm");
  let sheetName = `${carSpecs.model} ${carSpecs.configuration} (${date})`.substring(0, 100);
  const sheet = ss.insertSheet(sheetName);

  // 1. ШАПКА ТАБЛИЦЫ
  const specsData = [
    ["Автомобиль", carSpecs.model],
    ["Комплектация", carSpecs.configuration],
    ["Расход (л/100км)", carSpecs.fuel_consumption],
    ["Годовой пробег (км)", ANNUAL_MILEAGE],
    [`Цена топлива (${carSpecs.fuel_type})`, FUEL_PRICE],
    ["ИТОГО (р/км)", ""],
    ["В МЕСЯЦ (руб)", ""],
    ["В ГОД (руб)", ""]
  ];
  sheet.getRange(1, 1, 8, 2).setValues(specsData);
  
  // Стилизация шапки
  sheet.getRange(1, 1, 8, 1).setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange("B1:B2").setBackground("#f4cccc").setFontWeight("bold"); // Модель и комплектация
  sheet.getRange(6, 2, 3, 1).setFontWeight("bold").setNumberFormat("#,##0.00\"р.\"");
  sheet.getRange(6, 2).setFontColor("#cc0000"); // Итого р/км - красный

  // 2. ЗАГОЛОВКИ ТАБЛИЦЫ
  let currentRow = 10; 
  const header = [["Категория/Узел", "Мин. ресурс", "Макс. ресурс", "Цена детали", "Цена работы", "Стоимость 1 км, р/км"]];
  sheet.getRange(currentRow, 1, 1, 6).setValues(header).setBackground("#444444").setFontColor("white").setFontWeight("bold");
  currentRow++;

  const categories = [
    { title: "ОСНОВНЫЕ УЗЛЫ", data: mainNodes, color: "#d9ead3" },
    { title: "ПОДВЕСКА", data: suspension, color: "#fff2cc" },
    { title: "ГСМ", data: gsm, color: "#f4cccc" },
    { title: "ОБСЛУЖИВАНИЕ", data: maintenance, color: "#d0e0e3" },
    { title: "НАЛОГИ И СТРАХОВКИ", data: taxes, color: "#efefef" }
  ];

  categories.forEach(cat => {
    if (!cat.data || cat.data.length === 0) return;

    // Объединяем ячейки заголовка блока (кроме последней колонки)
    sheet.getRange(currentRow, 1, 1, 5).merge().setValue(cat.title).setFontWeight("bold").setBackground(cat.color).setHorizontalAlignment("left");
    sheet.getRange(currentRow, 6).setBackground(cat.color);
    currentRow++;

    // Формируем строки данных
    const rows = cat.data.map((item, index) => {
      const r = currentRow + index;
      
      // Логика ресурса для налогов: подставляем ссылку на годовой пробег из ячейки B4
      let resourceMin = item.resourse_min;
      if (cat.title === "НАЛОГИ И СТРАХОВКИ") {
        resourceMin = "=$B$4"; 
      }

      const formula = `=IF(B${r}>0; (D${r}+E${r})/B${r}; 0)`;
      return [item.name, resourceMin, item.resourse_max, item.price_detail, item.price_work, formula];
    });

    sheet.getRange(currentRow, 1, rows.length, 6).setValues(rows);
    sheet.getRange(currentRow, 4, rows.length, 3).setNumberFormat("#,##0.00\"р.\"");
    currentRow += rows.length + 1;
  });

  // 3. БЛОК ИТОГОВ
  sheet.getRange(currentRow, 1, 1, 5).merge().setValue("ИТОГОВЫЕ РАСЧЕТЫ").setFontWeight("bold").setBackground("#cfe2f3");
  sheet.getRange(currentRow, 6).setBackground("#cfe2f3");
  currentRow++;

  const fuelFormula = `=(B3 * B5) / 100`;
  const totalFormula = `=SUM(F11:F${currentRow})`; // Суммирует всё, включая топливо в следующей строке

  const summaryData = [
    ["Топливо (р/км)", "", "", "", "", fuelFormula],
    ["ВСЕГО (р/км)", "", "", "", "", totalFormula]
  ];

  sheet.getRange(currentRow, 1, 2, 6).setValues(summaryData);
  sheet.getRange(currentRow + 1, 1, 1, 6).setFontWeight("bold").setBorder(true, null, null, null, null, null);
  sheet.getRange(currentRow, 6, 2, 1).setNumberFormat("#,##0.00\"р.\"").setFontWeight("bold");

  // 4. ФИНАЛЬНЫЕ РАСЧЕТЫ В ШАПКЕ
  sheet.getRange(6, 2).setFormula(`=F${currentRow + 1}`); // Ссылка на ВСЕГО р/км
  sheet.getRange(8, 2).setFormula(`=B6 * B4`);           // В год = р/км * пробег
  sheet.getRange(7, 2).setFormula(`=B8 / 12`);           // В месяц = в год / 12

  // Автоподбор ширины и фиксация первой колонки
  sheet.autoResizeColumns(1, 6);
  sheet.setColumnWidth(1, 350);

  // ДОБАВЛЕНО: Возвращаем информацию о созданном листе
  return {
    carSpecs: carSpecs,
    spreadsheetId: ss.getId(),
    sheetId: sheet.getSheetId(),
    url: ss.getUrl() + "#gid=" + sheet.getSheetId() // Прямая ссылка на созданную вкладку
  };
}


