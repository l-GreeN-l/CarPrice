// Функция отображения интерфейса
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Калькулятор владения авто')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processCarData(carInput) {
  var results = [];
  var errors = []; // Массив для ваших кастомных сообщений

  try {
    let response = config_validation(carInput) 
    let cars = []
    cars.push(... response['cars']);
    errors.push(...response['errors']);
    
    // const cars = ['car1' , 'car2']
    // errors = ['Error 1', 'Error 2']

    
    if (cars.length > 0){
      let info = calls_and_promts(cars)

      info.forEach(function(item){
        let model = item["carSpecs"]['model'] + ' ' + item["carSpecs"]['configuration']
        results.push({ name: model, url: item.url });
      })
    }

    // results.push({ name: cars[0], url: 'https://docs.google.com/spreadsheets/d/1nr1hLBATUCKbTJy6-BPr6X36xzgNhFEuhyAx4xO5pSI/edit?usp=sharing' });
    // results.push({ name: cars[1], url: 'https://docs.google.com/spreadsheets/d/1nr1hLBATUCKbTJy6-BPr6X36xzgNhFEuhyAx4xO5pSI/edit?usp=sharing' });

    return {
      success: true,
      data: results,
      errors: errors 
    };
  } catch (e) {
    return { success: false, systemError: e.toString() };
  }
}