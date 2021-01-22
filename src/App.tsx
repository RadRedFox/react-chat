import React from 'react'
import UserProvider from './providers/UserProvider'

import Application from './components/App'

export default function App() {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  )
}
