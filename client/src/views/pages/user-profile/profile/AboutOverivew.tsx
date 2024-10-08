// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileTabCommonType } from 'src/types/apps/profileType'

import { getProfileData } from 'src/metadata/profileData'
import useSWR from 'swr'

// ** Import hooks
import { useAuth } from 'src/hooks/useAuth'
import userProfileService from 'src/service/userProfileService.service'
import { useEffect } from 'react'

const renderList = (arr: ProfileTabCommonType[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 3 },
            '& svg': { color: 'text.secondary' }
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon fontSize='1.25rem' icon={item.icon} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{item.value}</Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

const AboutOverivew = () => {
  // lấy dữ liệu từ data lưu vào auth.user
  const { user, setUser } = useAuth()

  const { data } = useSWR('GET_PROFILE_DATA', userProfileService.getUserProfile, {
    revalidateOnFocus: false,
    initialData: user,
    onSuccess: data => {
      if (data && data.data) {
        setUser(data.data)
      }
    }
  })

  useEffect(() => {
    if (data && data.data) {
      setUser(data.data)
    }
  }, [data, setUser])

  const { about, contacts, overview } = getProfileData.profile(user)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                About
              </Typography>
              {renderList(about)}
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Contacts
              </Typography>
              {renderList(contacts)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <div>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Overview
              </Typography>
              {renderList(overview)}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverivew
