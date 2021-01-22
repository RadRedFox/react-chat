import { Route, Link } from 'react-router-dom'

import SignOut from '../SignOut'
import ChatRoom from '../ChatRoom'

import './MainApp.scss'

export default function MainApp() {
	return (
		<main className="o-app">
			<header className="o-app--header">
				<h1 className="o-app--title">🎉🐱‍🏍🎉</h1>
			</header>
			<Route exact path="/" component={ ChatRoom } />
			<nav className="o-app--nav m-nav">
				<Link className="m-nav--item a-button -secondary" to="/">Chat</Link>
				<SignOut />
			</nav>
		</main>
	)
}
