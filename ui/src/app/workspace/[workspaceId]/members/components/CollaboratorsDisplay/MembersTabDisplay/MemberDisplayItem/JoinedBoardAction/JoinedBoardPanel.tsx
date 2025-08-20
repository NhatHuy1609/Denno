import JoinedBoardDisplay from './JoinedBoardDisplay'

type JoinedBoardPanelProps = {
  userId: string
  userName: string
  closePopoverFn: () => void
}

function JoinedBoardPanel({ userId, closePopoverFn }: JoinedBoardPanelProps) {
  return (
    <div className='auto'>
      <span className='mb-2 block text-center text-sm font-medium text-slate-800'>Workspaces boards</span>
      <p className='text-sm text-black'>Huy David is a member of the following Workspace boards:</p>
      <JoinedBoardDisplay userId={userId} />
    </div>
  )
}

export default JoinedBoardPanel
