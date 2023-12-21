import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { BASE_URL } from '../constants/settings'
import { isAuthenticated } from '../lib/localStorage'

const Result = () => {
  const [result, setResult] = useState<any>()

  const getGameResult = async () => {
    if (isAuthenticated()) {
      try {
        const response = await fetch(BASE_URL + '/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const user = (await response.json()).user
        const userId = user._id

        const response2 = await fetch(BASE_URL + '/getResult', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId }),
        })

        const gameResult = await response2.json()
        console.log(gameResult)

        setResult(gameResult)
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    getGameResult()
  }, [])
  return (
    <>
      {isAuthenticated() ? (
        <>
          {result && (
            <section className="bg-gray-50 dark:bg-gray-900">
              <div className="mx-auto flex flex-col items-center justify-center px-6 py-8  lg:py-2">
                <div className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                  <img
                    className="mr-2 h-28 w-32"
                    src="/litlogo.png"
                    alt="logo"
                  />
                  Wordle Blitz
                </div>
                <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
                  <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                      Result - {result.name}
                    </h1>

                    <div className="flex min-h-screen justify-center">
                      <div className="overflow-x-auto">
                        <table className="min-w-full rounded-xl bg-white shadow-md">
                          <thead>
                            <tr className="bg-blue-gray-100 text-gray-700">
                              <th className="px-4 py-3 text-left">Item</th>
                              <th className="px-4 py-3 text-left">Data</th>
                            </tr>
                          </thead>
                          <tbody className="text-blue-gray-900">
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">Name</td>
                              <td className="px-4 py-3">{result.name}</td>
                            </tr>
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">Email</td>
                              <td className="px-4 py-3">{result.email}</td>
                            </tr>
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">Score</td>
                              <td className="px-4 py-3">{result.score}</td>
                            </tr>
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">Total attempted</td>
                              <td className="px-4 py-3">{result.total}</td>
                            </tr>
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">Wins</td>
                              <td className="px-4 py-3">{result.wins}</td>
                            </tr>
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">Loses</td>
                              <td className="px-4 py-3">{result.loses}</td>
                            </tr>
                            <tr className="border-blue-gray-200 border-b">
                              <td className="px-4 py-3">
                                Average Time Per Puzzle (in seconds)
                              </td>
                              <td className="px-4 py-3">
                                {result.averageTimePerSolve}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <hr />
                        <h1 className="text-center text-xl font-bold">
                          Round Data
                        </h1>
                        {result.data.map((d: any) => (
                          <div className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <h5 className="text-l mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
                              {d.word}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                              {d.didWin
                                ? `You guessed this word correctly in ${d.numGuesses} moves!`
                                : `You couldn't guess this word!`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!result && <div>Loading...</div>}
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  )
}

export default Result
