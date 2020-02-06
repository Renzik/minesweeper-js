const width = 9
const height = 9

const tds = []

const table = document.createElement("tbody")
for (let h = 0; h < height; h++) {
  const tr = document.createElement("tr");
  for (let w = 0; w < width; w++) {
    const td = document.createElement("td");
    td.dataset.row = h;
    td.dataset.col = w;
    tds.push(td);
    tr.append(td);
  }
  table.append(tr);
}
document.getElementById("board").append(table);

const game = new Minesweeper(width, height)
game.seedBoard()
console.log(game.board)

document.getElementById("board").addEventListener("click", event => {
  if(event.target.tagName === 'TD') {
    const row = event.target.dataset.row
    const col = event.target.dataset.col
    const val = game.getTile(row, col)
    const currentTileVal = game.getTile(row, col)
    if(currentTileVal !== 'E' && currentTileVal !== 'B') return
    if(currentTileVal === 'B') {
      console.log('WE GOT BOMBED')
      console.log(event.target)
      event.target.classList.add('tile-bomb')
      // add logic to show all bombs and end game
      return
    }
    if(val !== 0 && val !== 'E') event.target.innerText = val
    // update tiles for neighbors
    const lastBoard = JSON.parse(JSON.stringify(game.board))
    game.flipTile(row, col)

    lastBoard.forEach( (row, r) => {
      row.forEach( (col, c) => {
        const lastVal = lastBoard[r][c]
        const newVal = game.getTile(r, c)
        if(lastVal !== newVal && newVal !== 'B') {
          //get td based on row and col
          const targetTD = queryTD(r, c)
          //reveal the td element
          const tdVal = game.getTile(r, c)
          if(tdVal !== 0 && tdVal !== 'E') {
            targetTD.innerText = tdVal
          }
          targetTD.classList.toggle(getTileClass(tdVal))
        }
      })
    })
  }
})

const queryTD = (row, col) => {
  const tdList = Array.from(document.querySelectorAll('td'))
  const foundTD = tdList.filter( el => {
    if(Number(el.dataset.row) == row && Number(el.dataset.col) == col) {
      return el
    }
  })[0]
  return foundTD
}

const getTileClass = (val) => {
  if(val === 0 || val === 'E') {
    return 'tile-clear'
  } else if(typeof Number(val) === 'number') {
    return 'tile-count'
  } else {
    return 'tile-bomb'
  }
}
