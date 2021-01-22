import React, { Component, createContext } from 'react'
import { auth } from '../contexts/Firebase'
import User, { UserObject } from '../models/User'

type UserContextObject = {
	user: User | null
}

export const UserContext = createContext<UserContextObject>( { user: null } )

type UserProviderState = {
	user: User | null
}

class UserProvider extends Component {
	state: UserProviderState = {
		user: null
	}

	componentDidMount = () => {
		auth.onAuthStateChanged( async ( userAuth ) => {
			if ( !userAuth ) {
				this.setState( { user: null } )
				return
			}

			const user = await User.CreateNewAsync( userAuth as unknown as UserObject )
			
			this.setState( { user: user } )
		} )
	}

	render() {
		return (
			<UserContext.Provider value={ this.state }>
				{ this.props.children }
			</UserContext.Provider>
		)
	}
}

export default UserProvider
