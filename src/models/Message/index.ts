import { firestore, serverTimestamp } from '../../contexts/Firebase'

const REFERENCES = {
	StorePath: 'messages',
	TakeAmount: 25
}

export interface MessageObject {
	id: string,
	text: string,
	createdAt: any,
	uid: string,
	photoURL: string,
	displayName: string
}

export default class Message {
	constructor(
		public id: string,
		public text: string,
		public createdAt: any,
		public uid: string,
		public photoURL: string,
		public displayName: string
	) {}

	public static GetLatestQuery( amount: number = REFERENCES.TakeAmount ) {
		const messagesRef = firestore.collection( REFERENCES.StorePath )
		const query = messagesRef.orderBy( 'createdAt' ).limit( amount )
		return query
	}

	public static async GetByIdAsync( id: string ): Promise<Message | null> {
		if ( !id ) return null

		try {
			const messageDoc = await firestore.doc( `${ REFERENCES.StorePath }/${ id }` ).get()
			const data = messageDoc.data()
			return new Message(
				id,
				data?.text,
				data?.createdAt,
				data?.uid,
				data?.photoURL,
				data?.displayName
			)
		} catch ( error ) {
			console.error( error )
		}

		return null
	}

	public static async GetLatestAsync( amount: number = REFERENCES.TakeAmount ): Promise<Array<Message>> {
		try {
			const query = Message.GetLatestQuery( amount )
			const messageDocs = await query.get()
			let temp: Array<Message> = []

			messageDocs.forEach( ( doc ) => {
				const data = doc.data() as MessageObject
				temp.push( new Message( doc.id , data.text, data.createdAt, data.uid, data.photoURL, data.displayName ) )
			} )

			return temp
		} catch ( error ) {
			console.error( error )
		}

		return []
	}

	public static async CreateNewAsync( text: string, uid: string, photoURL: string, displayName: string ): Promise<Message | null> {
		const messageRef = await firestore.collection( REFERENCES.StorePath ).add( {
			text,
			createdAt: serverTimestamp(),
			uid,
			photoURL,
			displayName
		} )

		return Message.GetByIdAsync( messageRef.id )
	}
}
