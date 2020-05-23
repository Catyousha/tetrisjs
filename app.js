document.addEventListener('DOMContentLoaded', () =>{
    //kotak game
    const grid = document.querySelector('.grid')
    //wadah balok tetris
    let squares = Array.from(document.querySelectorAll('.grid div'))
    //skor
    const ScoreDisplay = document.querySelector('#score')
    //tombol start
    const StartBtn = document.querySelector('#start-button')
    
    const width = 10 //lebar wadah balok
    let nextRandom = 0 //penentu balok selanjutnya
    let score = 0 //skor
    let timerId = null //waktu

//----The Tetrominoes----//
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
//----./The Tetrominoes----//

  //kumpulan balok-balok tetris
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPos = 4 //posisi awal ketika jatuh
  let currentRot = 0 //posisi rotasi awal

  //penentu balok yang jatuh pertama kali
  let randomTet = Math.floor(Math.random()*theTetrominoes.length)
  
  //balok yang sedang dikendalikan
  let current = theTetrominoes[randomTet][currentRot]

//----Drawers----//
  function draw(){
      //'warnai' balok yang sudengan dikendalikan dengan menambahkan kelas tetromino
      current.forEach(index => {
          //index yaitu nilai yang terdapat pada array masing-masing bentuk tetromino yang sedang dikendalikan
          //misal index pada balok L posisi 0 = [1,11,21,2]
          squares[currentPos + index].classList.add('tetromino')
          if(randomTet === 0){
            squares[currentPos + index].classList.add('blokL')
          }
          else if(randomTet === 1){
            squares[currentPos + index].classList.add('blokZ')
          }
          else if(randomTet === 2){
            squares[currentPos + index].classList.add('blokT')
          }
          else if(randomTet === 3){
            squares[currentPos + index].classList.add('blokO')
          }
          else if(randomTet === 4){
            squares[currentPos + index].classList.add('blokI')
          }
      })
  }

  function undraw(){
    //hapus warna yang sudah terpasang
    current.forEach(index => {
        squares[currentPos + index].classList.remove('tetromino')
        squares[currentPos + index].classList.remove('blokL')
        squares[currentPos + index].classList.remove('blokZ')
        squares[currentPos + index].classList.remove('blokT')
        squares[currentPos + index].classList.remove('blokO')
        squares[currentPos + index].classList.remove('blokI')
    })
  }
//----./Drawers----//



//----Keymap----//
  function control(e){
      if(timerId != null){
        if(e.keyCode === 37){
            moveLeft()
        }
        else if(e.keyCode === 38){
            rotateBlock()
        }
        else if(e.keyCode === 39){
            moveRight()
        }
        else if(e.keyCode === 40){
            moveDown()
        }
    }
  }
document.addEventListener('keydown', control)
//----./Keymap----//

draw()

//----Falling Down----//
  function moveDown(){
      undraw()
      currentPos += width //posisi turun 1 level
      draw()
      freeze()
  }

//----./Falling Down----//

//----Freezing----//
  function freeze(){
      //kalau level dibawahnya punya kelas 'taken'
      if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))){
          //balok saat ini diberi kelas 'taken' pula
          current.forEach(index => squares[currentPos + index].classList.add('taken'))
          newBlock()
          addScore()
          gameOver()
      }

  }

  function newBlock(){
      //balok tetris selanjutnya kemudian ditentukan oleh nextRandom
      randomTet = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[randomTet][currentRot]
      currentPos = 4
      draw()
      previewBlock()
  }
//----./Freezing----//

//----Movers----//
  function moveLeft(){
      undraw()
      //mendeteksi pinggir kiri
      //kalau balok yang dikendalikan posisinya habis dibagi lebar, berarti nyentuh pinggir kiri
      const isAtLeftEdge = current.some(
          index => (currentPos + index) % width === 0)
    
      //kalau ga nyentuh pinggir kiri ya digeser ke kiri
      if(!isAtLeftEdge) currentPos -=1

      //kalau balok yang dikendalikan nyentuh balok 'taken', geser ke kanan
      if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
          currentPos += 1
      }
      draw()
  }

  function moveRight(){
    undraw()
    //mendeteksi pinggir kanan
    //kalau balok yang dikendalikan posisinya melewati lebar, berarti nyentuh pinggir kanan
    const isAtRightEdge = current.some(index => (currentPos + index) % width === width-1)

    //kalau ga nyentuh pinggir kanan ya digeser ke kanan
    if(!isAtRightEdge) currentPos +=1

    //kalau balok yang dikendalikan nyentuh balok 'taken', geser ke kiri
    if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
        currentPos -= 1
    }
    draw()
}
//----./Movers----//

//----Rotate----//
  function rotateBlock(){
      undraw()
      //posisi balok bertambah 1
      currentRot++;
      //kalau melebihi panjang array balok yang dikendalikan, posisi set lagi ke 0
      if(currentRot === current.length){
          currentRot = 0
      }

      //balok yang dikendalikan berubah posisinya
      current = theTetrominoes[randomTet][currentRot]
      
      //kalau nabrak pinggir kanan, geser kekiri terus
      while((current.some(index => (currentPos + index) % width >= width-1))) currentPos -=1
      
      //kalau nabrak pinggir kiri, geser kekanan
      if((current.some(index => (currentPos + index) % width === 0))) currentPos +=1

      draw()
  }


//----./Rotate----//

//----Preview Block----//
  //preview balok selanjutnya
  const previewSquares = document.querySelectorAll('.mini-grid div')
  //lebar tampilan preview
  const previewWidth = 4
  //tampilkan balok urutan kesekian
  let displayIndex = 0

  //balok-balok yang ada
  const nextBlock = [
      [1, previewWidth+1, previewWidth*2+1, 2], //lTet
      [0,previewWidth,previewWidth+1,previewWidth*2+1], //zTet
      [1,previewWidth,previewWidth+1,previewWidth+2], //tTet
      [0,1,previewWidth,previewWidth+1], //oTet
      [1,previewWidth+1,previewWidth*2+1,previewWidth*3+1] //iTet
  ]

  function previewBlock(){
      //anggap lah sejenis fungsi undraw diatas
      previewSquares.forEach(square => {
          square.classList.remove('tetromino')
          square.classList.remove('blokL')
          square.classList.remove('blokZ')
          square.classList.remove('blokT')
          square.classList.remove('blokO')
          square.classList.remove('blokI')
      })
      //sejenis fungsi draw kek diatas
      nextBlock[nextRandom].forEach(index => {
          previewSquares[displayIndex + index].classList.add('tetromino')
          if(nextRandom === 0){
            previewSquares[displayIndex + index].classList.add('blokL')
          }
          else if(nextRandom === 1){
            previewSquares[displayIndex + index].classList.add('blokZ')
          }
          else if(nextRandom === 2){
            previewSquares[displayIndex + index].classList.add('blokT')
          }
          else if(nextRandom === 3){
            previewSquares[displayIndex + index].classList.add('blokO')
          }
          else if(nextRandom === 4){
            previewSquares[displayIndex + index].classList.add('blokI')
        }
      })
  }

//----./Preview Block----//

//----Button Functionality----//
  StartBtn.addEventListener('click', () => {
      //kalau diklik, interval berhenti dengan syarat pernah diklik untuk pertama kalinya
      if (timerId != null){
          clearInterval(timerId)
          timerId = null
      }
      else{
          //kalau diklik lagi, set interval
          draw()
          timerId = setInterval(moveDown, 500)
          nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            
      }
  })

//----./Button Functionality----//


//----Scoring----//
  function addScore(){
      for(let i = 0; i < 199; i += width){
          //deteksi baris setiap level
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
          //kalau satu baris memiliki kelas 'taken'
          if(row.every(index => squares[index].classList.contains('taken'))){
              //skor bertambah 10
              score+=10
              //tampilan skor berubah
              ScoreDisplay.innerHTML = score
              //pada baris-baris tersebut dihapus kelas taken dan tetromino
              row.forEach(index => {
                  squares[index].classList.remove('taken')
                  squares[index].classList.remove('tetromino')
                  squares[index].classList.remove('blokL')
                  squares[index].classList.remove('blokZ')
                  squares[index].classList.remove('blokT')
                  squares[index].classList.remove('blokO')
                  squares[index].classList.remove('blokI')
              })
              //wadah balok tetris yang 'finish' akan dihapus berdasarkan angka level sejumlah lebarnya
              const squaresRemoved = squares.splice(i, width)
              
              //wadah balok tetris akan diset ulang dengan menghapus bagian yang sudah 'finish'
              squares = squaresRemoved.concat(squares)
              //masukkan kembali semua wadah tersebut ke grid
              squares.forEach(cell => grid.appendChild(cell))
          }
      }
  }

//----./Scoring----//


//----Game Over----//
function gameOver(){
    //kalau balok tetris yang sedang dikendalikan memiliki kelas 'taken' saat level 0 / kurang dari width
    if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
        //set game over
        ScoreDisplay.innerHTML = "Game Over!"
        clearInterval(timerId)
        timerId = null
    }
}

//----./Game Over----//




})