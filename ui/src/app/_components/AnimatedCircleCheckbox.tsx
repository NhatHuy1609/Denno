import React from 'react'
import { motion, Variants } from 'framer-motion'
import { cn } from '@/lib/styles/utils'

type Props = {
  checked: boolean
  onChange: () => void
}

// sparks với position tối ưu
const SPARKS_CONFIG = [
  { rotation: 0, length: 12, index: 0 }, // ↑
  { rotation: 45, length: 8, index: 1 }, // ↗
  { rotation: 90, length: 12, index: 2 }, // →
  { rotation: 135, length: 8, index: 3 }, // ↘
  { rotation: 180, length: 12, index: 4 }, // ↓
  { rotation: 225, length: 8, index: 5 }, // ↙
  { rotation: 270, length: 12, index: 6 }, // ←
  { rotation: 315, length: 8, index: 7 } // ↖
].map((spark) => {
  const distance = spark.length / 2 + 8
  const radians = (spark.rotation * Math.PI) / 180
  const x = Math.sin(radians) * distance
  const y = -Math.cos(radians) * distance

  return {
    ...spark,
    targetX: x,
    targetY: y
  }
})

export const AnimatedCircleCheckbox = React.forwardRef<HTMLDivElement, Props>(({ checked, onChange }, ref) => {
  const checkVariants: Variants = {
    checked: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          type: 'spring',
          duration: 0.2,
          bounce: 0 // Loại bỏ bounce để mượt hơn
        },
        opacity: { duration: 0.05 }
      }
    },
    unchecked: {
      pathLength: 0,
      opacity: 0,
      transition: {
        pathLength: { duration: 0.1 }, // Giảm thời gian transition
        opacity: { duration: 0.05 }
      }
    }
  }

  const sparkVariants: Variants = {
    hidden: (custom: { rotation: number; targetX: number; targetY: number; index: number }) => ({
      opacity: 0,
      scale: 1,
      rotate: custom.rotation,
      translateX: custom.targetX,
      translateY: custom.targetY
    }),
    visible: (custom: { rotation: number; targetX: number; targetY: number; index: number }) => ({
      opacity: [0, 1, 0], // Fade out cuối để tự nhiên hơn
      scale: [1, 0.8, 0],
      rotate: custom.rotation,
      translateX: [custom.targetX, custom.targetX * 1.25, custom.targetX * 1.35],
      translateY: [custom.targetY, custom.targetY * 1.25, custom.targetY * 1.35],
      transition: {
        duration: 0.8, // Giảm duration
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing
      }
    })
  }

  return (
    <div
      ref={ref}
      role='checkbox'
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onChange()
        }
      }}
      className='relative inline-flex cursor-pointer items-center outline-none'
    >
      <motion.div
        className={cn(
          'relative flex size-4 items-center justify-center rounded-full border transition-colors duration-100',
          checked ? 'border-green-500 bg-green-500' : 'border-gray-500 bg-transparent'
        )}
        // Thêm layout animation để tránh reflow
        layout='position'
      >
        <svg
          width='12'
          height='12'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='pointer-events-none' // Tránh conflict với click events
        >
          <motion.path
            d='M5 12l5 5L20 7'
            stroke='white'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
            variants={checkVariants}
            animate={checked ? 'checked' : 'unchecked'}
            initial={false}
          />
        </svg>

        {/* Container cho sparks ở chính giữa */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          {SPARKS_CONFIG.map((spark, i) => (
            <motion.div
              key={`spark-${i}`}
              custom={spark} // Pass entire spark object
              variants={sparkVariants} // Choose your preferred version
              animate={checked ? 'visible' : 'hidden'}
              initial='hidden'
              className='absolute'
              style={{
                width: '1px',
                height: `${spark.length}px`,
                backgroundColor: '#4ade80',
                borderRadius: '1px',
                transformOrigin: 'center',
                rotate: spark.rotation
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
})
