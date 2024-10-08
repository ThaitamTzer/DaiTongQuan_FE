// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type User = {
  _id: string
  firstname: string
  lastname: string
  avatar: string
  rankID: RankId
  isBlock: boolean
}

export type RankId = {
  _id: string
  rankName: string
  rankIcon: string
}

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  billing: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type getAllUser = {
  _id: string
  firstname: string
  lastname: string
  email: string
  avatar: string
  createdAt: string
  isBlock: boolean
  avatarColor?: ThemeColor
  gender: string
}

export type AdminsType = {
  id: string
  fullname: string
  email: string
  role: [{ name: string }]
  roles: { data: [] }
  isBlock: boolean
  password: string
  avatarColor?: ThemeColor
}

export type getUpdateAdmin = {
  _id: string
  fullname: string
  email: string
  role: [{ _id: string; name: string }]
  password: string
}

export type UpdateAdminsType = {
  id: string
  fullname: string
  email: string
  roleId: string[]
  password: string
}

export type RoleType = {
  _id: string
  name: string
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
