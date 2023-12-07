import { useContext } from 'react'
import { UserContext } from './userContext.js'

export const useUserContext = () => useContext(UserContext)
