import { toast } from 'sonner'

const toastSuccess = (content: string) => {
  toast.success(content, {
    style: {
      color: 'green',
      borderColor: 'green'
    }
  })
}

const toastError = (content: string) => {
  toast.error(content, {
    style: {
      color: 'red',
      borderColor: 'red'
    }
  })
}

export { toastError, toastSuccess }
