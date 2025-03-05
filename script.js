// Ganti URL ini dengan URL Google Apps Script Web App Anda setelah di-deploy
const API_URL = 'https://script.google.com/macros/s/AKfycbweDis7UTmRSLrWzRNstjXB-JhCMsijWMW1cF5k1RnW1xdb7vWdycza65-qqxg6q_7_/exec';

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Populate headers
        const headerRow = document.getElementById('tableHeaders');
        data.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        // Populate data
        const tableBody = document.getElementById('tableBody');
        data.rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                // Format date if cell is a date
                if (cell instanceof Date) {
                    td.textContent = new Date(cell).toLocaleDateString();
                } else {
                    td.textContent = cell;
                }
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Terjadi kesalahan saat mengambil data');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', fetchData);