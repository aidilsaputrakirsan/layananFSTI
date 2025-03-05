// Ganti dengan URL Web App Google Apps Script Anda
const API_URL = 'https://script.google.com/macros/s/AKfycbwEauiflKLZmm49tru33tCtKnSGwuK5Oxenj2q-pbwWhL0DeBQT9M-Y1m3ZRCBcH4EC/exec';

async function fetchData() {
    try {
        console.log('Fetching data from:', API_URL);
        
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
        console.log('Received data:', data);  // Debug log
        
        // Show loading state
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="100%" class="text-center">Loading data...</td></tr>';
        
        // Handle empty or invalid response
        if (!data) {
            throw new Error('No data received');
        }
        
        // Clear existing content
        const headerRow = document.getElementById('tableHeaders');
        const tableBody = document.getElementById('tableBody');
        headerRow.innerHTML = '';
        tableBody.innerHTML = '';
        
        // Populate headers
        if (Array.isArray(data.headers)) {
            data.headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
        } else {
            throw new Error('Headers not found in response');
        }
        
        // Populate data
        if (Array.isArray(data.rows)) {
            data.rows.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    // Handle date formatting
                    if (typeof cell === 'string' && cell.match(/^\d{4}-\d{2}-\d{2}/)) {
                        const date = new Date(cell);
                        td.textContent = date.toLocaleDateString('id-ID');
                    } else {
                        td.textContent = cell || '';
                    }
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        } else {
            throw new Error('No rows found in response');
        }
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'text-muted small mt-2';
        timestamp.textContent = `Last updated: ${new Date().toLocaleString('id-ID')}`;
        document.querySelector('.card-body').appendChild(timestamp);
        
    } catch (error) {
        console.error('Error:', error);  // Debug log
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="100%" class="text-center text-danger">
                    <div class="alert alert-danger">
                        Error: ${error.message}
                        <br>
                        <small>Please check the console for more details.</small>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', fetchData);

// Add refresh button if needed
document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.createElement('button');
    refreshButton.className = 'btn btn-primary mb-3';
    refreshButton.textContent = 'Refresh Data';
    refreshButton.onclick = fetchData;
    document.querySelector('.card-body').insertBefore(refreshButton, document.querySelector('.table-responsive'));
});