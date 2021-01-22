import { useContext, useState, useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { UserContext } from '../../providers/UserProvider'

import Message, { MessageObject } from '../../models/Message'

import ChatMessage from '../ChatMessage'

export default function ChatRoom() {
	const { user } = useContext( UserContext )

	const dummy = useRef<HTMLDivElement>()

	const [ messages ] = useCollectionData<MessageObject>( Message.GetLatestQuery(), { idField: 'id' } )
	const [ formValue, setFormValue ] = useState( '' )

	const sendMessage = async ( e: React.FormEvent<HTMLFormElement> ) => {
		e.preventDefault()

		if ( !user ) return

		const { uid, photoURL, displayName } = user

		await Message.CreateNewAsync( formValue, uid, photoURL, displayName )

		setFormValue( '' )

		dummy?.current?.scrollIntoView( { behavior: 'smooth' } )
	}

	const tempMessages = new Array<MessageObject | null>(20).fill( null ).map( ( value, index ) => ( {
		id: String( index + 1 ),
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet eget sit amet tellus cras adipiscing enim.',
		createdAt: '01/22/2021T09:04:17-05:00',
		uid: index % 2 === 0 ? 'Nqtm3KpQPtQBb2egs0iL7CkqRim1' : 'rkeYcP2bNtU01AoAoQt2koTXMgS2',
		photoURL: index % 2 === 0 ? 'https://lh3.googleusercontent.com/a-/AOh14GiBmOCqmCN7zWnBa398laDjvx9whU8BZOOiWtpu6A=s96-c' : '',
		displayName: index % 2 === 0 ? 'Brandon Campbell' : 'RadRedFox'
	} ) )

	return (
		<section className="o-chat-room o-app--section">
			<div className="o-chat-room--chat-log">
				{ messages && messages.map( ( msg: Message ) => <ChatMessage key={ msg.id } message={ msg } /> ) }

				{/* { tempMessages && tempMessages.map( ( msg: MessageObject ) => <ChatMessage key={ msg.id } message={ msg } /> ) } */}

				<div ref={ dummy as any }></div>
			</div>
			<form className="o-chat-room--form" onSubmit={ sendMessage }>
				<div className="m-input-group">
					<input className="m-input-group--input a-input" value={ formValue } onChange={ ( e ) => setFormValue( e.target.value ) } />
					<button className="m-input-group--button a-button -primary" type="submit">Send!</button>
				</div>
			</form>
		</section>
	)
}
