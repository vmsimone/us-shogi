const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6-0DUMZGAaJBKxjTDxJ2cQk1gzTncLRKapPncMal6zV3cjAYgZXnsVCIlMQBDKZgUrfaenaw2_Y9X/pub?gid=1312652864&single=true&output=csv'

const dataContainer = document.getElementById('data-container')

async function fetchData() {
    try {
        const response = await fetch(sheetUrl)
        if (!response.ok) {
        throw new Error('Network response was not ok')
        }
        const textData = await response.text()
        const rows = textData.split('\n').map(row => row.split(','))
        
        let tableHtml = '<table>'
            
        // Create headers
        tableHtml += '<thead><tr>'
        rows[0].forEach(header => {
        tableHtml += `<th>${header}</th>`
        })
        tableHtml += '</tr></thead>'
        
        // Create body
        tableHtml += '<tbody>'
        rows.slice(1).forEach(rowData => {
        tableHtml += '<tr>'
        rowData.forEach(cell => {
            tableHtml += `<td>${cell}</td>`
        })
        tableHtml += '</tr>'
        })
        tableHtml += '</tbody>'
        
        tableHtml += '</table>'
        
        dataContainer.innerHTML = tableHtml
        
    } catch (error) {
        console.error('Error fetching or parsing data:', error)
        dataContainer.innerHTML = '<p>Could not load data.</p>'
    }
}

fetchData()