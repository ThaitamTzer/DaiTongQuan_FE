// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { EventDateType, AddEventSidebarType } from 'src/types/apps/calendarTypes'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date | string
  startDate: Date | string
  guests: string[] | string | undefined
  location: string
  isEncrypted?: boolean
  _id: string
}

const defaultState: DefaultStateType = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date(),
  location: '',
  _id: ''
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    encryptEvent,
    decryptEvent,
    drawerWidth,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // ** States
  const [values, setValues] = useState<DefaultStateType>(defaultState)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  const onSubmit = (data: { title: string }) => {
    const modifiedEvent = {
      title: data.title,
      location: values.location,
      isAllDay: values.allDay,
      startDateTime: new Date(values.startDate).toISOString(),
      endDateTime: new Date(values.endDate).toISOString(),
      note: values.description,
      isLoop: false,
      calendars: values.calendar,
      url: values.url
    }

    // Check if it's a new event or updating an existing one
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      dispatch(addEvent(modifiedEvent))
    } else {
      // Update the event
      dispatch(
        updateEvent({
          id: store.selectedEvent.id,
          isEncrypted: store.selectedEvent.extendedProps.isEncrypted,
          ...modifiedEvent
        })
      )

      // Check the encryption state and apply encryption or decryption accordingly
      if (values.isEncrypted) {
        dispatch(encryptEvent(store.selectedEvent.id))
      } else if (!values.isEncrypted) {
        dispatch(decryptEvent(store.selectedEvent.id))
      }
    }
    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = (date: Date) => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date).toISOString(), endDate: new Date(date).toISOString() })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent

      setValue('title', event.title || '')
      setValues({
        _id: event.id,
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? new Date(event.end).toISOString() : new Date(event.start).toISOString(),
        startDate: event.start !== null ? new Date(event.start).toISOString() : new Date().toISOString(),
        location: event.extendedProps.location || '',
        isEncrypted: event.extendedProps.isEncrypted || false
      })
    }

    // eslint-disable-next-line
  }, [setValue, store.selectedEvent])

  console.log(new Date(values.startDate).toISOString(), new Date(values.endDate).toISOString())

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Update
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </Fragment>
      )
    }
  }

  const RenderEncryptSwitch = () => {
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      return null
    } else {
      return (
        <FormControl sx={{ mb: 4 }}>
          <FormControlLabel
            label='Encrypt'
            control={
              <Switch
                checked={values.isEncrypted}
                onChange={e => setValues({ ...values, isEncrypted: e.target.checked })}
              />
            }
          />
        </FormControl>
      )
    }
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h5'>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? 'Update Event' : 'Add Event'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? (
            <IconButton
              size='small'
              onClick={handleDeleteEvent}
              sx={{ color: 'text.primary', mr: store.selectedEvent !== null ? 1 : 0 }}
            >
              <Icon icon='tabler:trash' fontSize='1.25rem' />
            </IconButton>
          ) : null}
          <IconButton
            size='small'
            onClick={handleSidebarClose}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label='Title'
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  placeholder='Event Title'
                  error={Boolean(errors.title)}
                  {...(errors.title && { helperText: 'This field is required' })}
                />
              )}
            />
            <CustomTextField
              select
              fullWidth
              sx={{ mb: 4 }}
              label='Calendar'
              SelectProps={{
                value: values.calendar,
                onChange: e => setValues({ ...values, calendar: e.target.value as string })
              }}
            >
              <MenuItem value='Work'>Work</MenuItem>
              <MenuItem value='Business'>Business</MenuItem>
              <MenuItem value='Family'>Family</MenuItem>
              <MenuItem value='Holiday'>Holiday</MenuItem>
              <MenuItem value='ETC'>ETC</MenuItem>
            </CustomTextField>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={new Date(values.endDate)}
                selected={values.startDate ? new Date(values.startDate) : null}
                startDate={new Date(values.startDate)}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={(date: Date) => setValues({ ...values, startDate: date.toISOString() })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={new Date(values.endDate)}
                selected={values.endDate ? new Date(values.endDate) : null}
                minDate={new Date(values.startDate)}
                startDate={new Date(values.startDate)}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={(date: Date) => setValues({ ...values, endDate: date.toISOString() })}
              />
            </Box>
            <FormControl sx={{ mb: 4 }}>
              <FormControlLabel
                label='All Day'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl>
            <CustomTextField
              fullWidth
              type='url'
              id='event-url'
              sx={{ mb: 4 }}
              label='Event URL'
              value={values.url}
              placeholder='https://www.google.com'
              onChange={e => setValues({ ...values, url: e.target.value })}
            />

            <CustomTextField
              select
              fullWidth
              label='Guests'
              sx={{ mb: 4 }}
              SelectProps={{
                multiple: true,
                value: values.guests,
                onChange: e => setValues({ ...values, guests: e.target.value as string })
              }}
            >
              <MenuItem value='bruce'>Bruce</MenuItem>
              <MenuItem value='clark'>Clark</MenuItem>
              <MenuItem value='diana'>Diana</MenuItem>
              <MenuItem value='john'>John</MenuItem>
              <MenuItem value='barry'>Barry</MenuItem>
            </CustomTextField>
            <CustomTextField
              fullWidth
              sx={{ mb: 4 }}
              label='Location'
              id='event-location'
              value={values.location}
              onChange={e => setValues({ ...values, location: e.target.value })}
            />
            <CustomTextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 6.5 }}
              label='Description'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 6
              }}
            >
              <RenderEncryptSwitch />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
