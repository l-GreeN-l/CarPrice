function askGemini(promptText) {
  const API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!API_KEY) {
    return "Ошибка: Ключ GEMINI_API_KEY не найден в свойствах скрипта!";
  }

  const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

const payload = {
    "contents": [{
      "parts": [{
        "text": promptText
      }]
    }],
    "generationConfig": {
        "temperature": 0,
        // "responseMimeType": "application/json" // Исправлено на camelCase
      }
  };

  const options = {
    // Настройки request
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {


    const response = UrlFetchApp.fetch(API_URL, options);
    const resText = response.getContentText();
    const json = JSON.parse(resText);
    
    // Проверка на внутренние ошибки API (например, лимиты или плохой промпт)
    if (json.error) {
      console.error("Ошибка API: " + json.error.message);
      return "Ошибка API: " + json.error.message;
    }

    // Возвращаем чистый текст ответа
    if (json.candidates && json.candidates[0].content) {
          let rawText = json.candidates[0].content.parts[0].text;
          // Удаляем возможные кавычки ```json и лишние пробелы
          const cleanJson = rawText.replace(/```json|```/g, "").trim();
          return JSON.parse(cleanJson);
    } else {
      return "ИИ прислал пустой ответ или заблокировал запрос.";
    }

  } catch (e) {
    console.error("Ошибка связи: " + e);
    return "Ошибка при обращении к ИИ: " + e.toString();
  }
}