import React, { useEffect, useState } from 'react'
import DatePicker from '@/app/_features/DatePicker'
import DateInputs from './CardDateInputs'
import { DateRange } from '@/app/_features/DatePicker/types'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import useUpdateCardDatesMutation from '@/app/_hooks/mutation/card/useUpdateCardDatesMutation'
import { toastError } from '@/ui'
import { cardTypesDto } from '@/service/api/card'

type Props = {
  onClosePanel: () => void
}

function CardDatesUpdateForm({ onClosePanel }: Props) {
  const { cardData, refetchCard } = useCardDetailModalContext()
  const { id: cardId, startDate, dueDate } = cardData || {}

  const [mode, setMode] = useState<'single' | 'range'>('single')
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  // Thêm state để track selectedDate đang represent cho startDate hay endDate
  const [singleDateType, setSingleDateType] = useState<'start' | 'end'>('end') // default là 'end' (due date)

  useEffect(() => {
    if (startDate && dueDate) {
      setMode('range')
      setSelectedRange({ start: new Date(startDate), end: new Date(dueDate) })
      setSelectedDate(null)
    } else if (startDate) {
      setMode('single')
      setSingleDateType('start')
      setSelectedDate(new Date(startDate))
      setSelectedRange({ start: new Date(startDate), end: null })
    } else if (dueDate) {
      setMode('single')
      setSingleDateType('end')
      setSelectedDate(new Date(dueDate))
      setSelectedRange({ start: null, end: new Date(dueDate) })
    } else {
      // reset khi cả hai đều null
      setMode('single')
      setSingleDateType('end')
      setSelectedDate(null)
      setSelectedRange({ start: null, end: null })
    }
  }, [startDate, dueDate])

  const { mutateAsync, isPending: isUpdatingCardDates } = useUpdateCardDatesMutation({
    onSuccess: () => {
      refetchCard?.()
    },
    onError: () => {
      toastError('Failed to update card dates!')
    },
    onSettled: () => {
      onClosePanel()
    }
  })

  const handleDateRangeUpdate = (range: DateRange) => {
    // Chỉ cập nhật selectedRange khi mode === 'range'
    if (mode === 'range') {
      setSelectedRange(range)
    }
  }

  const handleSingleDateUpdate = (date: Date | null) => {
    // Chỉ cập nhật selectedDate khi mode === 'single'
    if (mode === 'single') {
      setSelectedDate(date)
    }
  }

  const handleChangeMode = (newMode: 'single' | 'range') => {
    setMode(newMode)

    if (newMode === 'range') {
      // Chuyển sang range mode: clear selectedDate
      setSelectedDate(null)
    } else {
      // Chuyển sang single mode: clear selectedRange và set selectedDate từ range hiện tại
      const currentRange = selectedRange
      if (singleDateType === 'start' && currentRange.start) {
        setSelectedDate(currentRange.start)
      } else if (singleDateType === 'end' && currentRange.end) {
        setSelectedDate(currentRange.end)
      }
      setSelectedRange({ start: null, end: null })
    }
  }

  // Hàm để xác định selectedDate đang represent cho startDate hay endDate
  const handleSingleDateTypeChange = (type: 'start' | 'end') => {
    if (mode === 'single') {
      setSingleDateType(type)

      // Cập nhật selectedDate dựa trên type mới
      if (type === 'start' && selectedRange.start) {
        setSelectedDate(selectedRange.start)
      } else if (type === 'end' && selectedRange.end) {
        setSelectedDate(selectedRange.end)
      } else {
        setSelectedDate(null)
      }
    }
  }

  const handleClickSaveCardDates = async () => {
    if (!cardId) return

    const updateCardDatesDto: cardTypesDto.UpdateCardDatesDto = {
      startDate: null,
      dueDate: null
    }

    if (mode === 'single') {
      if (singleDateType === 'start') {
        updateCardDatesDto.startDate = selectedDate?.toUTCString()
      } else {
        updateCardDatesDto.dueDate = selectedDate?.toUTCString()
      }
    } else {
      updateCardDatesDto.startDate = selectedRange.start?.toUTCString()
      updateCardDatesDto.dueDate = selectedRange.end?.toUTCString()
    }

    await mutateAsync({
      id: cardId,
      updateCardDatesDto
    })
  }

  return (
    <div className='w-full'>
      <DatePicker
        mode={mode}
        initialDate={selectedDate}
        initialDateRange={selectedRange}
        onDateSelect={handleSingleDateUpdate}
        onDateRangeSelect={handleDateRangeUpdate}
      />
      <DateInputs
        mode={mode}
        selectedDate={selectedDate}
        selectedRange={selectedRange}
        onModeChange={handleChangeMode}
        onSingleDateUpdate={handleSingleDateUpdate}
        onRangeUpdate={handleDateRangeUpdate}
        singleDateType={singleDateType}
        onSingleDateTypeChange={handleSingleDateTypeChange}
      />
      <CustomizableButton
        onClick={handleClickSaveCardDates}
        intent='primary'
        value='Save'
        className='flex w-full items-center justify-center'
        loading={isUpdatingCardDates}
      />
    </div>
  )
}

export default CardDatesUpdateForm
