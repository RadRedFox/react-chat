import { useContext } from 'react'
import { UserContext } from '../../providers/UserProvider'

import Message from '../../models/Message'

type ChatMessageProps = {
	message: Message
}

export default function ChatMessage( props: ChatMessageProps ) {
	const { user } = useContext(UserContext)

	const { text, uid, photoURL, displayName } = props.message

	const messageClass = uid === user?.uid
		? 'sent'
		: 'received'

	return (
		<article className={ `m-chat-message -${ messageClass }` }>
			<div className="m-chat-message--image-wrapper">
				{ photoURL !== ''
					? <img className="m-chat-message--image" src={ photoURL } alt={ displayName } />
					: <div className="m-chat-message--text-image">{ displayName.substr( 0, 1 ) }</div>
				}
			</div>
			<div className="m-chat-message--content">
				{ text && (
					<p className="m-chat-message--content-text">{ text }</p>
				) }
			</div>
		</article>
	)
}
