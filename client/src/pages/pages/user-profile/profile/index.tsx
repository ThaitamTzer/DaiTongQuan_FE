// ** MUI Components
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports

import UserProfileHeader from 'src/views/pages/user-profile/UserProfileHeader'
import { useTheme } from '@mui/system'
import Profile from 'src/views/pages/user-profile/profile'

const UserProfile = () => {
  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // Adjust 'sm' to your desired breakpoint

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: isMobile ? 'none' : 'sticky',
          top: isMobile ? 0 : 80
        }}
      >
        <Profile />
      </Grid>
    </Grid>
  )
}

UserProfile.acl = {
  action: 'read',
  subject: 'member-page'
}

export default UserProfile
