import { useState } from 'react'
import { Link } from 'react-router-dom'
import User from '../../models/User'

import './SignIn.scss'

export default function SignIn() {
	const [ email, setEmail ] = useState( '' )
	const [ password, setPassword ] = useState( '' )
	const [ error, setError ] = useState( null as any )

	const onChange = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
		const { name, value } = e.currentTarget

		if ( name === 'email' ) setEmail( value )

		if ( name === 'password' ) setPassword( value )
	}

	const onSubmit = ( e: React.FormEvent<HTMLFormElement> ): void => {
		e.preventDefault()

		try {
			User.SignInWithEmail( email, password )
		} catch ( error ) {
			setError( 'Error signing in, please try again' )
			console.error( error )
		}
	}

	return (
		<main className="o-login">
			<section className="o-login--container">
				<header className="o-login--header">
					<h1>🎉🐱‍🏍🎉</h1>
				</header>
				<form className="o-login--form" onSubmit={ onSubmit }>
					{ error !== null && (
						<span className="o-login--message -error">{ error }</span>
					) }
					<label className="a-label" htmlFor="email">Email</label>
					<input className="a-input" id="email" name="email" type="email" placeholder="Email address" autoFocus required onChange={ onChange } />
					<label className="a-label" htmlFor="password">Password</label>
					<input className="a-input" id="password" name="password" type="password" placeholder="Password" required onChange={ onChange } />
					<button className="a-button -primary -center -medium" type="submit">Log In</button>
				</form>
				<h6>OR</h6>
				<div className="o-login--sso">
					<button className="a-button -primary" onClick={ User.SignInWithGoogle }>
						<div className="a-button--icon-wrapper">
							<img 
								className="a-button--icon" 
								src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
								alt="Google Sign In"
							/>
						</div>
						<span className="a-button--text">Sign in with Google</span>
					</button>
				</div>
				<footer className="o-login--footer">
					<p>Need an account?   <Link to="/signup">Sign up here</Link></p>
					<Link to="/passwordreset">Forgot password</Link>
				</footer>
			</section>
		</main>
	)
}
