import { useState } from 'react'
import { Link } from 'react-router-dom'
import User from '../../models/User'

import './PasswordReset.scss'

export default function PasswordReset() {
	const [ email, setEmail ] = useState( '' )
	const [ emailSent, setEmailSent ] = useState( false )
	const [ error, setError ] = useState( null as any )

	const onChange = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
		const { name, value } = e.currentTarget

		if ( name === 'email' ) setEmail( value )
	}

	const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ): Promise<void> => {
		e.preventDefault()

		try {
			await User.SendPasswordReset( email )
			setEmailSent( true )
			setTimeout( () => setEmailSent( false ), 3000 )
		} catch ( error ) {
			setError( 'Problem sending password reset email, please try again.' )
			console.error( error )
		}
	}

	return (
		<main className="o-login">
			<section className="o-login--container">
				<header className="o-login--header">
					<h1>Reset Password</h1>
				</header>
				<form className="o-login--form" onSubmit={ onSubmit }>
					{ emailSent && (
						<span className="o-login--message -okay">If an account with the provided email esits, a message has been sent.</span>
					) }
					{ error !== null && (
						<span className="o-login--message -error">{ error }</span>
					) }
					<label className="a-label" htmlFor="email">Email</label>
					<input className="a-input" id="email" name="email" type="email" placeholder="Email address" autoFocus required onChange={ onChange } />
					<button className="a-button -primary -center -medium" type="submit">Send</button>
				</form>
				<footer className="o-login--footer">
					<p>Already have an account?   <Link to="/">Log in here</Link></p>
				</footer>
			</section>
		</main>
	)
}
