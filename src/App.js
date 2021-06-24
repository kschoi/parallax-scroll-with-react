import React, { useState, useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import {
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from 'framer-motion'
import lightBox from './assets/images/light-box.png'
import darkBox from './assets/images/dark-box.png'

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function App() {
  const [shouldShow, setShouldShow] = useState(false)

  /**
   * [해설]
   * useViewportScroll로 뷰포트 스크롤의 scrollX, scrollY, scrollXProgress, scrollYProgress, motionValue를 가져올 수 있습니다.
   */
  const { scrollY } = useViewportScroll()

  /**
   * [해설]
   * 마지막 스크롤 위치를 기억할 ref를 생성합니다.
   */
  const lastYPos = useRef(0)

  /**
   * [해설]
   * 모든 motion 컴포넌트에는 애니메이션 값의 상태와 속도를 추적하는 motionValue를 자동으로 생성합니다.
   * `useMotionValue`으로 직접 motionValue를 생성하면 아래와 같은 일들을 할 수 있습니다.
   * 1. 상태를 설정하고 가져옵니다.
   * 2. 여러 컴포넌트에 전달하여 전체 컴포넌트에에서 모션을 동기화합니다.
   * 3. `useTransform` 훅을 이용하여 motionValue를 체이닝할 수 있습니다.
   * 4. 반응의 렌더 사이클을 트리거하지 않고 시각적 속성을 업데이트합니다.
   */
  const y = useMotionValue(0)
  /**
   * [해설]
   * useTransform 훅을 이용하면 motionValue를 체이닝할 수 있습니다.
   */
  const lightBoxY = useTransform(y, () => scrollY.current / 2)
  const darkBoxY = useTransform(y, () => scrollY.current / 5)

  useEffect(() => {
    /**
     * [해설]
     * throttle을 적용하지 않으면 스크롤 이벤트가 과다하게 발생됩니다. (iOS의 사파리 예외)
     * leading: true 옵션은 첫 이벤트 발생시 그 이벤트는 일단 반영됩니다.
     * 이후의 연속하는 이벤트는 묶어서 처리됩니다.
     */
    const handleScroll = throttle(
      () => {
        console.log('scrolled')
        // 스크롤 윗방향으로 할 때
        const isScrollingUp = scrollY.current < lastYPos.current

        setShouldShow(isScrollingUp)
        lastYPos.current = scrollY.current
      },
      250,
      { leading: true },
    )

    window.addEventListener('scroll', handleScroll, false)

    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [])

  return (
    <motion.div
      className="text-white"
      style={{ height: '200vh' }}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
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
    </motion.div>
  )
}

export default App
