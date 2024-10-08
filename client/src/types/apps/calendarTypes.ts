// ** Types
import { Dispatch } from 'redux'

// ** Theme Type Import
import { ThemeColor } from 'src/@core/layouts/types'

export type CalendarFiltersType = 'Work' | 'Business' | 'Family' | 'Holiday' | 'ETC'

export type EventDateType = Date | null | undefined

export type CalendarColors = {
  ETC: ThemeColor
  Family: ThemeColor
  Holiday: ThemeColor
  Work: ThemeColor
  Business: ThemeColor
}

export type EventType = {
  id: string
  url: string
  title: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    location?: string
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
    isEncrypted?: boolean
  }
}

export type EventTypes = {
  isEncrypted: boolean | undefined
  title: string
  location: string
  isAllDay: boolean
  startDateTime: Date | string
  endDateTime: Date | string
  note: string
  isLoop: boolean
  calendars: string
  url: string
  id: string
}

export type AddEventType = {
  url: string
  title: string
  display: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    calendar: string
    description: string | undefined
    guests: string[] | string | undefined
  }
}

export type AddEvent = {
  title: string
  location: string
  isAllDay: boolean
  startDateTime: Date | string
  endDateTime: Date | string
  note: string
  isLoop: boolean
  calendars: string
  url: string
}

export type EventStateType = {
  url: string
  title: string
  allDay: boolean
  guests: string[]
  description: string
  endDate: Date | string
  startDate: Date | string
  calendar: CalendarFiltersType | string
}

export type CalendarStoreType = {
  events: EventType[]
  selectedEvent: null | EventType
  selectedCalendars: CalendarFiltersType[] | string[]
}

export type CalendarType = {
  calendarApi: any
  dispatch: Dispatch<any>
  store: CalendarStoreType
  direction: 'ltr' | 'rtl'
  calendarsColor: CalendarColors
  setCalendarApi: (val: any) => void
  handleLeftSidebarToggle: () => void
  updateEvent: (event: EventTypes | any) => void
  handleAddEventSidebarToggle: () => void
  handleSelectEvent: (event: EventType) => void
}

export type SidebarLeftType = {
  mdAbove: boolean
  calendarApi: any
  dispatch: Dispatch<any>
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  store: CalendarStoreType
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleAllCalendars: (val: boolean) => void
  handleSelectEvent: (event: null | EventType) => void
  handleCalendarsUpdate: (val: CalendarFiltersType) => void
}

export type ListOfEvents = {
  dispatch: Dispatch<any>
  store: CalendarStoreType
}

export type AddEventSidebarType = {
  calendarApi: any
  drawerWidth: number
  dispatch: Dispatch<any>
  store: CalendarStoreType
  addEventSidebarOpen: boolean
  deleteEvent: (_id: string) => void
  addEvent: (event: AddEvent) => void
  updateEvent: (event: EventTypes) => void
  encryptEvent: (scheduleId: string) => void
  decryptEvent: (scheduleId: string) => void
  handleAddEventSidebarToggle: () => void
  handleSelectEvent: (event: null | EventType) => void
}
