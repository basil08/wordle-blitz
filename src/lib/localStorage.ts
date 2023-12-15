const gameStateKey = 'gameState'
const archiveGameStateKey = 'archiveGameState'
const highContrastKey = 'highContrast'
const myGameKey = 'MY_GAME'

export type StoredGameState = {
  guesses: string[]
}

export const isAuthenticated = () => {
  return localStorage.getItem('token')
}
export type StoredCurrentRoundGameState = {
  round: number
  word: String
  didWin: boolean
  didLose: boolean
  numGuesses: number
  timestamp: number | null
}

export const saveCurrentRoundDataToLocalStorage = (
  gameState: StoredCurrentRoundGameState
) => {
  const states = localStorage.getItem(myGameKey)

  if (!states) {
    const newArray = new Array<StoredCurrentRoundGameState>(gameState)
    localStorage.setItem(myGameKey, JSON.stringify(newArray))
  } else {
    const parsedStates = JSON.parse(states) as StoredCurrentRoundGameState[]
    parsedStates.push(gameState)
    localStorage.setItem(myGameKey, JSON.stringify(parsedStates))
  }
}

export const saveGameStateToLocalStorage = (
  isLatestGame: boolean,
  gameState: StoredGameState
) => {
  const key = isLatestGame ? gameStateKey : archiveGameStateKey
  localStorage.setItem(key, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = (isLatestGame: boolean) => {
  const key = isLatestGame ? gameStateKey : archiveGameStateKey
  const state = localStorage.getItem(key)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}
