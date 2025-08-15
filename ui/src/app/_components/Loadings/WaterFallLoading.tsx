import React from 'react'
import { motion } from 'framer-motion'

function WaterFallLoading() {
  return (
    <motion.ul className='flex gap-[2px]'>
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.li
          key={index}
          className='aspect-[1/3] h-4 origin-top bg-gray-400'
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
    </motion.ul>
  )
}

export default WaterFallLoading
