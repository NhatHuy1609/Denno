'use client'

import LandingHeader from '../LandingHeader'
import Link from 'next/link'
import { FaBolt, FaCheckCircle, FaTh, FaUsers } from 'react-icons/fa'

export default function General() {
  return (
    <main>
      <LandingHeader />
      <main className='flex-1'>
        <section className='w-full bg-blue-50 py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Manage Tasks with Ease
                </h1>
                <p className='mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl'>
                  Denno helps you organize, track, and manage your tasks efficiently. Boost your
                  productivity today!
                </p>
              </div>
              <div className='space-x-4'>
                <button className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'>
                  Get Started
                </button>
                <button className='rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-100'>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full bg-white py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl'>
              Key Features
            </h2>
            <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3'>
              <div className='flex flex-col items-center space-y-2 rounded-lg border-gray-200 p-4'>
                <FaTh className='h-12 w-12 text-blue-600' />
                <h3 className='text-xl font-bold'>Intuitive Boards</h3>
                <p className='text-center text-sm text-gray-500'>
                  Organize your tasks visually with our easy-to-use board layout
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border-gray-200 p-4'>
                <FaUsers className='h-12 w-12 text-blue-600' />
                <h3 className='text-xl font-bold'>Team Collaboration</h3>
                <p className='text-center text-sm text-gray-500'>
                  Work together seamlessly with your team members
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border-gray-200 p-4'>
                <FaCheckCircle className='h-12 w-12 text-blue-600' />
                <h3 className='text-xl font-bold'>Task Tracking</h3>
                <p className='text-center text-sm text-gray-500'>
                  Keep track of your progress and never miss a deadline
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full bg-gray-100 py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Ready to Get Started?
                </h2>
                <p className='mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Join thousands of teams already using Denno to boost their productivity.
                </p>
              </div>
              <div className='w-full max-w-sm space-y-2'>
                <form className='flex space-x-2'>
                  <input
                    className='max-w-lg flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600'
                    placeholder='Enter your email'
                    type='email'
                  />
                  <button
                    className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
                    type='submit'
                  >
                    Sign Up
                  </button>
                </form>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  By signing up, you agree to our{' '}
                  <Link className='underline underline-offset-2 hover:text-blue-500' href='#'>
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © 2024 Denno. All rights reserved.
        </p>
        <nav className='flex gap-4 sm:ml-auto sm:gap-6'>
          <Link className='text-xs underline-offset-4 hover:underline' href='#'>
            Terms of Service
          </Link>
          <Link className='text-xs underline-offset-4 hover:underline' href='#'>
            Privacy
          </Link>
        </nav>
      </footer>
    </main>
  )
}
