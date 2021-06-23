import React, { useState, useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import lightBox from './assets/images/light-box.png'
import darkBox from './assets/images/dark-box.png'

function App() {
  const [shouldShow, setShouldShow] = useState(false)
  const lastYPos = useRef(0)
  const y = useMotionValue(0)
  const lightBoxY = useTransform(y, (value) => {
    return value / 2
  })
  const darkBoxY = useTransform(y, (value) => value / 3)

  /**
   * [해설]
   * throttle을 적용하지 않으면 스크롤 이벤트가 과다하게 발생됩니다. (iOS의 사파리 예외)
   * leading: true 옵션은 첫 이벤트 발생시 그 이벤트는 일단 반영됩니다.
   * 이후의 연속하는 이벤트는 묶어서 처리됩니다.
   */
  const handleScroll = throttle(
    () => {
      const yPos = window.scrollY
      const isScrollingUp = yPos < lastYPos.current

      setShouldShow(isScrollingUp)
      lastYPos.current = yPos
      console.log('throttled Y:', lastYPos.current)
    },
    350,
    { leading: false },
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, false)

    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [])

  return (
    <div className="text-white" style={{ height: '200vh' }}>
      <motion.div
        className="sticky z-50 top-0 inset-x-0"
        animate={{ opacity: shouldShow ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <h1 className="text-3xl font-medium">motion ui</h1>
      </motion.div>
      <motion.img
        src={lightBox}
        alt=""
        className="absolute top-0 w-full"
        style={{
          y: lightBoxY,
        }}
      />
      <motion.img
        src={darkBox}
        alt=""
        className="absolute top-0 w-full"
        style={{
          y: darkBoxY,
        }}
      />
    </div>
  )
}

export default App
