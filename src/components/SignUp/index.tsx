import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import User from '../../models/User'

import './SignUp.scss'

export default function SignUp() {
	const history = useHistory()

	const [ displayName, setDisplayName ] = useState( '' )
	const [ email, setEmail ] = useState( '' )
	const [ password, setPassword ] = useState( '' )
	const [ error, setError ] = useState( null as any )

	const onChange = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
		const { name, value } = e.currentTarget

		if ( name === 'displayName' ) setDisplayName( value )

		if ( name === 'email' ) setEmail( value )

		if ( name === 'password' ) setPassword( value )
	}

	const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ): Promise<void> => {
		e.preventDefault()

		try {
			await User.CreateWithEmailAsync( email, password, displayName )
			history.push( '/' )
		} catch ( error ) {
			setError( 'Error signing up, please try again.')
			console.error( error )
		}
	}

	return (
		<main className="o-login">
			<section className="o-login--container">
				<header className="o-login--header">
					<h1>Sign Up</h1>
				</header>
				<form className="o-login--form" onSubmit={ onSubmit }>
					{ error !== null && (
						<span className="o-login--message -error">{ error }</span>
					) }
					<label className="a-label" htmlFor="displayName">Username</label>
					<input className="a-input" id="displayName" name="displayName" type="text" placeholder="Username" autoFocus required onChange={ onChange } />
					<label className="a-label" htmlFor="email">Email</label>
					<input className="a-input" id="email" name="email" type="email" placeholder="Email address" required onChange={ onChange } />
					<label className="a-label" htmlFor="password">Password</label>
					<input className="a-input" id="password" name="password" type="password" placeholder="Password" required onChange={ onChange } />
					<button className="a-button -primary -center -medium" type="submit">Log In</button>
				</form>
				<footer className="o-login--footer">
					<p>Already have an account?   <Link to="/">Log in here</Link></p>
				</footer>
			</section>
		</main>
	)
}
