// Ganti URL ini dengan URL Google Apps Script Web App Anda
const API_URL = 'https://script.google.com/macros/s/AKfycbz5FNB-vzfX-nSR_ZVBWzUDBM0XPJsK5xa8Sj_dtYReSOKezbG_a_Ej48Qt8cYVoWtw/exec';

async function fetchData() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.headers || !data.rows) {
            throw new Error('Data format tidak sesuai');
        }
        
        // Clear existing content
        const headerRow = document.getElementById('tableHeaders');
        const tableBody = document.getElementById('tableBody');
        headerRow.innerHTML = '';
        tableBody.innerHTML = '';
        
        // Populate headers
        data.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        // Populate data
        data.rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                // Format date if cell looks like a date string
                if (typeof cell === 'string' && cell.match(/^\d{4}-\d{2}-\d{2}/)) {
                    td.textContent = new Date(cell).toLocaleDateString('id-ID');
                } else {
                    td.textContent = cell || '';
                }
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="100%" class="text-center text-danger">
                    Error: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', fetchData);