import React from 'react'

function LeaveBoardAction() {
  return (
    <div className='w-full px-4 py-2'>
      <h3 className='text-center text-sm font-medium text-slate-700'>Leave Workspace</h3>
      <p className='my-4 block text-sm'>
        You will become a guest of this workspace and will only be able to access boards you are currently a member of
      </p>
      <button className='flex w-full items-center justify-center rounded-sm bg-red-600 py-2 text-sm font-semibold text-white'>
        Leave Workspace
      </button>
    </div>
  )
}

export default LeaveBoardAction
