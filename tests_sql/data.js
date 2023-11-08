const fs = require('fs');
const csv = require('csv-parser');

function readDataFromCSVFile(filePath, callback) {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      callback(results);
    })
    .on('error', (error) => {
      // Обработка ошибок при чтении файла
      console.error('Error reading CSV file:', error);
    });
}

function writeDataToFile(data) {
  const formattedData = JSON.stringify(data, null, 2);
  const exportString = `const sql_data = ${formattedData};\nmodule.exports = {sql_data};`;
  fs.writeFile('./sql_data.js', exportString, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data has been written to output.js');
    }
  });
}

// Пример использования функции для чтения данных из файла
const filePath = '/Users/kseniamelihova/Desktop/Диплом/учеьная часть/injection-checker/src/SQLiV3.csv'; // Путь к вашему файлу CSV
readDataFromCSVFile(filePath, (data) => {
  writeDataToFile(data);
  // Здесь вы можете выполнить необходимые операции с данными из файла
});