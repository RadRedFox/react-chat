import { useHistory } from 'react-router-dom'

import User from '../../models/User'

export default function SignOut() {
	const history = useHistory()

	const onClick = ( e: React.MouseEvent<HTMLElement> ): void => {
		User.SignOutCurrentUser()
		history.push( '/' )
	}

	return (
		<button className="m-nav--item a-button -primary -ghost -medium" onClick={ onClick }>Sign Out</button>
	)
}
