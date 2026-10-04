const tournamentSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6-0DUMZGAaJBKxjTDxJ2cQk1gzTncLRKapPncMal6zV3cjAYgZXnsVCIlMQBDKZgUrfaenaw2_Y9X/pub?gid=1312652864&single=true&output=csv'

const playerSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6-0DUMZGAaJBKxjTDxJ2cQk1gzTncLRKapPncMal6zV3cjAYgZXnsVCIlMQBDKZgUrfaenaw2_Y9X/pub?gid=0&single=true&output=csv'

const dataContainer = document.getElementById('tournament-data-container')
const playerContainer = document.getElementById('player-data-container')

// Columns to display, in order. `key` is the header name in the sheet.
// Turns a rank like "4 Dan", "Shodan" or "3 Kyu" into a number that sorts by strength
// (6 Dan = 6 ... Shodan = 1 ... 1 Kyu = -1 ... 6 Kyu = -6). Unranked/provisional -> NaN.
function rankValue(rank) {
    if (/shodan/i.test(rank)) return 1
    const dan = rank.match(/(\d+)\s*dan/i)
    if (dan) return Number(dan[1])
    const kyu = rank.match(/(\d+)\s*kyu/i)
    if (kyu) return -Number(kyu[1])
    return NaN
}

// `sortValue` (optional) converts a cell to a number for sorting; otherwise text is compared
const playerColumns = [
    { key: 'Name', label: 'Name' },
    { key: 'Last Known Rank', label: 'Rank', sortValue: rankValue },
    { key: 'ELO', label: 'ELO', numeric: true, sortValue: Number },
    { key: 'Games', label: 'Games', numeric: true, sortValue: Number },
    { key: 'Last Active', label: 'Last Active', sortValue: Number }
]

const tournamentColumns = [
    { key: 'Month', label: 'Month' },
    { key: 'Year', label: 'Year' },
    { key: 'Tournament', label: 'Tournament' },
    { key: 'Location', label: 'Location' },
    { key: 'Format', label: 'Format' },
    { key: 'Champion', label: 'Champion' },
    { key: '# Players', label: 'Players', numeric: true },
    { key: '# Pro Guests', label: 'Pro Guests', numeric: true }
]

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December']

// Parses CSV text, handling quoted fields that contain commas, quotes or newlines
function parseCsv(text) {
    const rows = []
    let row = []
    let field = ''
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (inQuotes) {
            if (char === '"' && text[i + 1] === '"') {
                field += '"'
                i++
            } else if (char === '"') {
                inQuotes = false
            } else {
                field += char
            }
        } else if (char === '"') {
            inQuotes = true
        } else if (char === ',') {
            row.push(field)
            field = ''
        } else if (char === '\n' || char === '\r') {
            if (char === '\r' && text[i + 1] === '\n') i++
            row.push(field)
            rows.push(row)
            row = []
            field = ''
        } else {
            field += char
        }
    }
    if (field !== '' || row.length) {
        row.push(field)
        rows.push(row)
    }
    return rows.filter(r => r.some(cell => cell.trim() !== ''))
}

function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Fetches a sheet and returns its rows as objects keyed by header name
async function fetchRecords(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    const rows = parseCsv(await response.text())
    const headers = rows[0].map(h => h.trim())

    return rows.slice(1).map(cells => {
        const record = {}
        headers.forEach((header, i) => {
            record[header] = (cells[i] || '').trim()
        })
        return record
    })
}

// Renders records into a scrollable table inside the container.
// If `sort` ({ key, dir, onSort }) is given, headers become clickable sort controls.
function renderTable(container, columns, records, sort) {
    let tableHtml = '<div class="table-wrapper"><table class="data-table">'

    tableHtml += '<thead><tr>'
    columns.forEach(col => {
        const classes = []
        if (col.numeric) classes.push('num')
        if (!sort) {
            tableHtml += `<th scope="col"${classes.length ? ` class="${classes.join(' ')}"` : ''}>${col.label}</th>`
            return
        }
        classes.push('sortable')
        const active = sort.key === col.key
        const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'
        const arrow = active ? (sort.dir === 'asc' ? '&#9650;' : '&#9660;') : ''
        tableHtml += `<th scope="col" class="${classes.join(' ')}" data-key="${escapeHtml(col.key)}" ` +
            `tabindex="0" aria-sort="${ariaSort}">${col.label}<span class="sort-arrow" aria-hidden="true">${arrow}</span></th>`
    })
    tableHtml += '</tr></thead>'

    tableHtml += '<tbody>'
    records.forEach(record => {
        tableHtml += '<tr>'
        columns.forEach(col => {
            const value = record[col.key] || ''
            tableHtml += `<td${col.numeric ? ' class="num"' : ''}>${escapeHtml(value)}</td>`
        })
        tableHtml += '</tr>'
    })
    tableHtml += '</tbody></table></div>'

    container.innerHTML = tableHtml

    if (sort) {
        container.querySelectorAll('th.sortable').forEach(th => {
            const trigger = () => sort.onSort(th.dataset.key)
            th.addEventListener('click', trigger)
            th.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    trigger()
                }
            })
        })
    }
}

async function loadTournaments() {
    try {
        const tournaments = await fetchRecords(tournamentSheetUrl)

        // Most recent first: year descending, then month descending within a year
        tournaments.sort((a, b) => {
            const yearDiff = Number(b.Year) - Number(a.Year)
            if (yearDiff !== 0) return yearDiff
            return monthNames.indexOf(b.Month) - monthNames.indexOf(a.Month)
        })

        renderTable(dataContainer, tournamentColumns, tournaments)
    } catch (error) {
        console.error('Error fetching or parsing tournament data:', error)
        dataContainer.innerHTML = '<p>Could not load data.</p>'
    }
}

async function loadPlayers() {
    try {
        // Only list players with at least 3 games
        const minGames = 3
        const players = (await fetchRecords(playerSheetUrl)).filter(player => Number(player.Games) >= minGames)

        // "Last Active" is just the year of the Last Event (e.g. 9/12/2026 -> 2026)
        players.forEach(player => {
            const match = player['Last Event'].match(/\d{4}/)
            player['Last Active'] = match ? match[0] : ''
        })

        // Most recently active year first, then highest ELO within the same year.
        // Players with a missing year or ELO go last.
        players.sort((a, b) => {
            const yearDiff = (Number(b['Last Active']) || 0) - (Number(a['Last Active']) || 0)
            if (yearDiff !== 0) return yearDiff
            return (Number(b.ELO) || 0) - (Number(a.ELO) || 0)
        })

        // Clicking a header sorts by that column; clicking it again reverses the order.
        // Until a header is clicked, the default order above is kept.
        const sort = { key: null, dir: 'asc' }

        const sortedPlayers = () => {
            if (!sort.key) return players
            const col = playerColumns.find(c => c.key === sort.key)
            const direction = sort.dir === 'asc' ? 1 : -1
            const valueOf = player => col.sortValue ? col.sortValue(player[col.key]) : player[col.key].toLowerCase()
            const isEmpty = value => value === '' || Number.isNaN(value)

            return [...players].sort((a, b) => {
                const aValue = valueOf(a)
                const bValue = valueOf(b)
                // Blank values always go last, whichever direction is chosen
                if (isEmpty(aValue) || isEmpty(bValue)) return isEmpty(aValue) - isEmpty(bValue)
                if (aValue === bValue) return 0
                return (aValue < bValue ? -1 : 1) * direction
            })
        }

        const draw = () => renderTable(playerContainer, playerColumns, sortedPlayers(), {
            key: sort.key,
            dir: sort.dir,
            onSort: key => {
                if (sort.key === key) {
                    sort.dir = sort.dir === 'asc' ? 'desc' : 'asc'
                } else {
                    // Numbers start high-to-low (best first); text starts A-Z
                    sort.key = key
                    sort.dir = playerColumns.find(c => c.key === key).sortValue ? 'desc' : 'asc'
                }
                draw()
            }
        })

        draw()
    } catch (error) {
        console.error('Error fetching or parsing player data:', error)
        playerContainer.innerHTML = '<p>Could not load data.</p>'
    }
}

loadTournaments()
loadPlayers()