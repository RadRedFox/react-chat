import { useContext } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { UserContext } from '../../providers/UserProvider'

import SignIn from '../SignIn'
import SignUp from '../SignUp'
import PasswordReset from '../PasswordReset'
import MainApp from '../MainApp'

export default function Application() {
	const { user } = useContext(UserContext)

	return (
		<Router>
			{ user
				? <>
					<MainApp />
				</>
				: <>
					<Route exact path="/" component={ SignIn } />
					<Route path="/signup" component={ SignUp } />
					<Route path="/passwordreset" component={ PasswordReset } />
				</>
			}
		</Router>
	)
}
