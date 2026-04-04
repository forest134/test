'use client'

import { useState, useCallback, useEffect } from 'react'

// Sudoku puzzle generator and solver
function generateSudoku(): number[][] {
  const base: number[][] = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]
  return base
}

function solveSudoku(board: number[][]): boolean {
  const empty = findEmpty(board)
  if (!empty) return true
  const [row, col] = empty
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, num, row, col)) {
      board[row][col] = num
      if (solveSudoku(board)) return true
      board[row][col] = 0
    }
  }
  return false
}

function findEmpty(board: number[][]): [number, number] | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return [i, j]
    }
  }
  return null
}

function isValid(board: number[][], num: number, row: number, col: number): boolean {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (board[row][j] === num) return false
  }
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false
  }
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) return false
    }
  }
  return true
}

function isSolved(board: number[][], initial: number[][]): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return false
      if (board[i][j] !== initial[i][j] && initial[i][j] !== 0) {
        // User modified an initial number
      }
    }
  }
  return true
}

export default function Sudoku() {
  const [initial, setInitial] = useState<number[][]>([])
  const [board, setBoard] = useState<number[][]>([])
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [solved, setSolved] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const newPuzzle = generateSudoku()
    setInitial(newPuzzle.map(row => [...row]))
    setBoard(newPuzzle.map(row => [...row]))
  }, [])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (solved) return
    setSelected([row, col])
    setError(false)
  }, [solved])

  const handleNumberClick = useCallback((num: number) => {
    if (!selected || solved) return
    const [row, col] = selected
    if (initial[row][col] !== 0) return // Can't modify initial numbers

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = num
    setBoard(newBoard)

    // Check if valid so far
    if (num !== 0 && !isValid(newBoard, num, row, col)) {
      setError(true)
    }
  }, [selected, solved, initial, board])

  const handleSolve = useCallback(() => {
    if (!selected) return
    const [row, col] = selected
    if (initial[row][col] !== 0) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = 0
    solveSudoku(newBoard)
    setBoard(newBoard)
    setSolved(true)
  }, [selected, initial, board])

  const handleReset = useCallback(() => {
    setBoard(initial.map(r => [...r]))
    setSelected(null)
    setSolved(false)
    setError(false)
  }, [initial])

  const isInitial = (row: number, col: number) => initial[row][col] !== 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-8">数独</h1>
        
        {/* Sudoku Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="grid grid-cols-9 gap-px bg-gray-300 rounded-lg overflow-hidden">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  className={`
                    w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-lg font-medium
                    transition-all duration-150
                    ${isInitial(i, j) ? 'bg-gray-100 text-indigo-900 font-bold' : 'bg-white text-gray-800'}
                    ${selected && selected[0] === i && selected[1] === j ? 'ring-2 ring-indigo-500 ring-inset' : ''}
                    ${selected && selected[0] === i && selected[1] !== j ? 'bg-indigo-50' : ''}
                    ${selected && selected[1] === j && selected[0] !== i ? 'bg-indigo-50' : ''}
                    ${selected && Math.floor(i / 3) === Math.floor(selected[0] / 3) && Math.floor(j / 3) === Math.floor(selected[1] / 3) ? 'bg-indigo-50' : ''}
                    ${error && selected && selected[0] === i && selected[1] === j ? 'bg-red-100 text-red-600' : ''}
                    hover:bg-indigo-100
                    ${(i + 1) % 3 === 0 && i !== 8 ? 'border-b-2 border-gray-400' : ''}
                    ${(j + 1) % 3 === 0 && j !== 8 ? 'border-r-2 border-gray-400' : ''}
                  `}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-9 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-10 h-10 bg-white rounded-lg shadow text-lg font-semibold text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleNumberClick(0)}
            className="flex-1 py-3 bg-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          >
            清除
          </button>
          <button
            onClick={handleSolve}
            disabled={!selected}
            className="flex-1 py-3 bg-indigo-600 rounded-lg font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            求解
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-indigo-200 rounded-lg font-medium text-indigo-800 hover:bg-indigo-300 transition-colors"
          >
            重置
          </button>
        </div>

        {solved && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg text-center text-green-800 font-medium">
            🎉 恭喜！你已经完成了数独！
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 rounded-lg text-center text-red-800 font-medium">
            ⚠️ 这个数字不符合数独规则，请重新输入。
          </div>
        )}
      </div>
    </main>
  )
}
