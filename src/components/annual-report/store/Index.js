import { configureStore } from '@reduxjs/toolkit'
import reducer from '../reducer/Index'

const store = configureStore( { reducer: reducer } )
export default store;