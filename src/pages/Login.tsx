import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { BASE_URL } from '../constants/settings'
import { isAuthenticated } from '../lib/localStorage'

const Login = () => {
  const [email, setEmail] = useState<String>()
  const [password, setPassword] = useState<String>()
  const [error, setError] = useState<String>()
  const [isLogged, setIsLogged] = useState<Boolean>(isAuthenticated() !== null)

  const submit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (!email || !password) {
      return
    }

    fetch(BASE_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password: password }),
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
        setIsLogged(true)
      })
      .catch((err) => {
        setError(
          'User validation failed! Please try again with correct email and password!'
        )
        console.error(err)
      })
  }

  return (
    <>
      {error && <div>{error}</div>}
      {isLogged && <Navigate to="/game" />}
      {!isLogged && (
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
            <div className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
              <img className="mr-2 h-28 w-32" src="/litlogo.png" alt="logo" />
              Wordle Blitz
            </div>
            <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
              <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                  Login
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email (enter the one used for reg)
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      placeholder="amogh@madarchod.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password (received on email)
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <button
                    onClick={(e) => submit(e)}
                    className="dark:text-primary hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600  dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg border bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Login
