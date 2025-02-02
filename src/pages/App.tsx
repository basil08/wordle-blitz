import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Navigate } from 'react-router-dom'

import { AlertContainer } from '../components/alerts/AlertContainer'
import { Grid } from '../components/grid/Grid'
import { Keyboard } from '../components/keyboard/Keyboard'
import { InfoModal } from '../components/modals/InfoModal'
import { SettingsModal } from '../components/modals/SettingsModal'
import { Navbar } from '../components/navbar/Navbar'
import {
  BASE_URL,
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from '../constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  COUNTDOWN,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
} from '../constants/strings'
import { useAlert } from '../context/AlertContext'
import { isInAppBrowser } from '../lib/browser'
import {
  StoredCurrentRoundGameState,
  getStoredIsHighContrastMode,
  isAuthenticated,
  loadGameStateFromLocalStorage,
  saveCurrentRoundDataToLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
} from '../lib/localStorage'
import { addStatsForCompletedGame, loadStats } from '../lib/stats'
import {
  getGameDate,
  getIsLatestGame,
  getSolution,
  isWordInWordList,
  unicodeLength,
} from '../lib/words'

function App() {
  const isLatestGame = getIsLatestGame()
  const gameDate = getGameDate()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: light)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
  // const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  //
  const initialCountDown = Number(COUNTDOWN) || 1800
  //
  const [countdown, setCountdown] = useState(() => {
    const storedCountdown = localStorage.getItem('countdown')
    return storedCountdown ? parseInt(storedCountdown, 10) : initialCountDown
  })
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)
  // const {solution, solutionIndex } = getSolution();
  const [solution, setSolution] = useState(() => {
    return getSolution()['solution']
  })
  const [isGameOver, setIsGameOver] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(
    () => {
      const loaded = loadGameStateFromLocalStorage(isLatestGame)
      // if (loaded?.solution !== solution) {
      //   return []
      // }

      if (!loaded) {
        return []
      }

      const gameWasWon = loaded.guesses.includes(solution)
      // if (gameWasWon) {
      //   setIsGameWon(true)
      // }
      // if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      //   setIsGameLost(true)
      //   showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
      //     persist: true,
      //   })
      // }
      return loaded?.guesses
    }
    // []
  )

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.removeItem('countdown')
    }
  }, [])

  const [stats, setStats] = useState(() => loadStats())

  // const [isHardMode, setIsHardMode] = useState(
  //   localStorage.getItem('gameMode')
  //     ? localStorage.getItem('gameMode') === 'hard'
  //     : false
  // )

  const [gameCount, setGameCount] = useState(1)

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  })

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update local storage when countdown changes
  useEffect(() => {
    localStorage.setItem('countdown', countdown.toString())
  }, [countdown])

  // Retrieve countdown from local storage during page load
  useEffect(() => {
    const storedCountdown = localStorage.getItem('countdown')
    if (storedCountdown) {
      setCountdown(parseInt(storedCountdown, 10))
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  // const handleHardMode = (isHard: boolean) => {
  //   if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
  //     setIsHardMode(isHard)
  //     localStorage.setItem('gameMode', 'normal')
  //   } else {
  //     showErrorAlert(HARD_MODE_ALERT_MESSAGE)
  //   }
  // }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage(getIsLatestGame(), { guesses })
  }, [guesses])

  // useEffect(() => {
  //   if (isGameWon) {

  //     // const winMessage =
  //     //   WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
  //     // const delayMs = REVEAL_TIME_MS * solution.length

  //     // showSuccessAlert(winMessage, {
  //     //   delayMs,
  //     //   onClose: () => setIsStatsModalOpen(true),
  //     // })

  //   }

  //   if (isGameLost) {
  //   //   setTimeout(
  //   //     () => {
  //   //       setIsStatsModalOpen(true)
  //   //     },
  //   //     (solution.length + 1) * REVEAL_TIME_MS
  //   //   )

  //   }
  //   setGameCount(gameCount+1);
  //   const state: StoredCurrentRoundGameState = {
  //     round: gameCount,
  //     word: solution,
  //     didWin: isGameWon,
  //     didLose: isGameLost,
  //     numGuesses: guesses.length,
  //     timestamp: new Date().valueOf()
  //   }
  //   saveCurrentRoundDataToLocalStorage(state);
  //   setIsGameLost(false);
  //   setIsGameWon(false);
  // }, [isGameWon, isGameLost])

  useEffect(() => {
    setGuesses([])
    setCurrentGuess('')
    setSolution(getSolution()['solution'])
  }, [gameCount])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  useEffect(() => {
    saveGameData()
  }, [countdown])

  const saveGameData = async () => {
    if (Number(countdown) === 0) {
      try {
        const gameData = localStorage.getItem('MY_GAME')
        const response = await fetch(BASE_URL + '/save', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameData: gameData ? gameData : [] }),
        })
        setIsGameOver(true)
      } catch (err) {
        console.log('Error while saving data to server', err)
      }
    }
  }
  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    // if (isHardMode) {
    //   const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses)
    //   if (firstMissingReveal) {
    //     setCurrentRowClass('jiggle')
    //     return showErrorAlert(firstMissingReveal, {
    //       onClose: clearCurrentRowClass,
    //     })
    //   }
    // }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * solution.length)

    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (currentGuess === solution) {
        // if (isLatestGame) {
        //   setStats(addStatsForCompletedGame(stats, guesses.length))
        // }

        const state: StoredCurrentRoundGameState = {
          round: gameCount,
          word: solution,
          didWin: true,
          didLose: false,
          numGuesses: guesses.length + 1,
          timestamp: new Date().valueOf(),
        }
        saveCurrentRoundDataToLocalStorage(state)
        setGameCount(gameCount + 1)

        return
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        }

        const state: StoredCurrentRoundGameState = {
          round: gameCount,
          word: solution,
          didWin: false,
          didLose: true,
          numGuesses: guesses.length + 1,
          timestamp: new Date().valueOf(),
        }
        saveCurrentRoundDataToLocalStorage(state)
        setGameCount(gameCount + 1)

        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: false,
          delayMs: REVEAL_TIME_MS * solution.length + 1,
        })
      }
    }
  }

  return (
    <>
      {isAuthenticated() ? (
        isGameOver ? (
          <Navigate to="/result" />
        ) : (
          <Div100vh>
            <div className="flex h-full flex-col">
              <Navbar
                setIsInfoModalOpen={setIsInfoModalOpen}
                setIsStatsModalOpen={setIsStatsModalOpen}
                setIsDatePickerModalOpen={setIsDatePickerModalOpen}
                setIsSettingsModalOpen={setIsSettingsModalOpen}
              />

              {!isLatestGame && (
                <div className="flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
                  </p>
                </div>
              )}
              {/* <div className="text-white">{solution}</div> */}

              <div className="mx-auto flex w-full grow flex-col px-1 pb-8 pt-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
                <div className="flex grow flex-col justify-center pb-6 short:pb-2">
                  <div className="text-center">
                    {countdown <= 0 && (
                      <div className="m-3 p-3 text-lg font-medium text-white">
                        Your time is over!
                      </div>
                    )}

                    {countdown > 0 && (
                      <span className="m-3 p-3 text-lg font-medium text-black dark:text-white">
                        {new Date(countdown * 1000)
                          .toISOString()
                          .substring(14, 19)}
                      </span>
                    )}
                  </div>

                  <Grid
                    solution={solution}
                    guesses={guesses}
                    currentGuess={currentGuess}
                    isRevealing={isRevealing}
                    currentRowClassName={currentRowClass}
                  />
                </div>
                <Keyboard
                  onChar={onChar}
                  onDelete={onDelete}
                  onEnter={onEnter}
                  solution={solution}
                  guesses={guesses}
                  isRevealing={isRevealing}
                />
                <InfoModal
                  isOpen={isInfoModalOpen}
                  handleClose={() => setIsInfoModalOpen(false)}
                />
                {/* <StatsModal
                isOpen={isStatsModalOpen}
                handleClose={() => setIsStatsModalOpen(false)}
                solution={solution}
                guesses={guesses}
                gameStats={stats}
                isLatestGame={isLatestGame}
                isGameLost={isGameLost}
                isGameWon={isGameWon}
                handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
                handleShareFailure={() =>
                  showErrorAlert(SHARE_FAILURE_TEXT, {
                    durationMs: LONG_ALERT_TIME_MS,
                  })
                }
                handleMigrateStatsButton={() => {
                  setIsStatsModalOpen(false)
                  setIsMigrateStatsModalOpen(true)
                }}
                isHardMode={false}
                isDarkMode={isDarkMode}
                isHighContrastMode={isHighContrastMode}
                numberOfGuessesMade={guesses.length}
              /> */}
                {/* <DatePickerModal
                isOpen={isDatePickerModalOpen}
                initialDate={solutionGameDate}
                handleSelectDate={(d) => {
                  setIsDatePickerModalOpen(false)
                  setGameDate(d)
                }}
                handleClose={() => setIsDatePickerModalOpen(false)}
              /> */}
                {/* <MigrateStatsModal
                isOpen={isMigrateStatsModalOpen}
                handleClose={() => setIsMigrateStatsModalOpen(false)}
              /> */}
                <SettingsModal
                  isOpen={isSettingsModalOpen}
                  handleClose={() => setIsSettingsModalOpen(false)}
                  isHardMode={false}
                  handleHardMode={() => {
                    return
                  }}
                  isDarkMode={isDarkMode}
                  handleDarkMode={handleDarkMode}
                  isHighContrastMode={isHighContrastMode}
                  handleHighContrastMode={handleHighContrastMode}
                />
                <AlertContainer />
              </div>
            </div>
          </Div100vh>
        )
      ) : (
        <Navigate to="/login" />
      )}
    </>
  )
}

export default App
