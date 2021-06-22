import React, { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'
import { motion, useMotionValue } from 'framer-motion'

function App() {
  const y = useMotionValue(0)
  const [lastYPos, setLastPos] = useState(0)

  const handleScroll = throttle(
    () => {
      console.log('scrolled')
    },
    400,
    { leading: true },
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, false)

    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [lastYPos])

  return (
    <div className="min-h-screen bg-gray-500">
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <div style={{ height: '200vh' }}>Page</div>
      </motion.div>
    </div>
  )
}

export default App
