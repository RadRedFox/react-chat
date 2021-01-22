import { auth, SignIn, firestore } from '../../contexts/Firebase'

const REFERENCES = {
	StorePath: 'users'
}

enum AuthProviders {
	Local = '',
	Google = 'firebase'
}

export interface UserObject {
	uid: string,
	displayName: string,
	email: string,
	photoURL: string
	isLoggedIn: boolean
	providerId?: string
}

export default class User {
	constructor(
		public uid: string,
		public displayName: string,
		public email: string,
		public photoURL: string,
		public isLoggedIn: boolean,
		public providerId?: string
	) {}

	public async UpdateAsync( password?: string ): Promise<void> {
		if ( auth.currentUser?.uid !== this.uid ) return

		if ( auth.currentUser.providerId !== AuthProviders.Local ) return

		const user = await User.GetByIdAsync( this.uid )

		if ( !user ) return

		const userRef = firestore.doc( `${ REFERENCES.StorePath }/${ user.uid }` )
		userRef.update( { displayName: this.displayName, email: this.email } )

		if ( !password ) return

		auth.currentUser.updatePassword( password )
	}

	public static SendPasswordReset( email: string ): Promise<void> {
		return auth.sendPasswordResetEmail( email )
	}

	private static async LogInCurrentUser(): Promise<void> {
		try {
			const userRef = firestore.doc( `${ REFERENCES.StorePath }/${ auth.currentUser?.uid }` )
			const userSnapshot = await userRef.get()
			
			if ( !userSnapshot.exists ) return
			
			userRef.update( { isLoggedIn: true } )
		} catch ( error ) {
			console.error( error )
		}
	}

	public static async SignInWithEmail( email: string, password: string ): Promise<void> {
		try {
			await SignIn.WithEmail( email, password )
			User.LogInCurrentUser()
		} catch ( error ) {
			throw new Error( error )
		}
	}

	public static async SignInWithGoogle(): Promise<void> {
		try {
			await SignIn.WithGoogle()
			User.LogInCurrentUser()
		} catch ( error ) {
			console.error( error )
		}
	}

	public static async SignOutCurrentUser(): Promise<void> {
		try {
			const userRef = firestore.doc( `${ REFERENCES.StorePath }/${ auth.currentUser?.uid }` )
			const userSnapshot = await userRef.get()
			
			if ( !userSnapshot.exists ) return
			
			userRef.update( { isLoggedIn: false } )
		} catch ( error ) {
			console.error( error )
		}
		auth.signOut()
	}

	public static async GetSignedInUsersAsync( uidToSkip?: string ): Promise<Array<User>> {
		try {
			const usersCollection = firestore.collection(REFERENCES.StorePath)
			let query = usersCollection.where( 'isLoggedIn', '==', true )

			const snapshot = await query.get()
			const temp: Array<any> = []

			snapshot.docs.forEach( ( doc ) => {
				const { email, photoURL, displayName, isLoggedIn, providerId } = doc.data() as unknown as UserObject

				temp.push( new User(
					doc.id,
					displayName,
					email,
					photoURL,
					isLoggedIn,
					providerId
				) )
			} )

			return uidToSkip
				? temp.filter( ( user ) => user.uid !== uidToSkip )
				: temp
		} catch ( error ) {
			console.error( error )
		}

		return []
	}

	public static async GetByIdAsync( uid: string ): Promise<User | null> {
		if ( !uid ) return null

		try {
			const userdoc = await firestore.doc( `${ REFERENCES.StorePath }/${ uid }` ).get()
			const data = userdoc.data()
			return new User(
				uid,
				data?.displayName,
				data?.email,
				data?.photoURL,
				data?.providerId
			)
		} catch ( error ) {
			console.error( error )
		}

		return null
	}

	public static async CreateWithEmailAsync( email: string, password: string, displayName: string ) {
		try {
			const { user } = await auth.createUserWithEmailAndPassword( email, password )
			if ( !user ) throw new Error( 'Error creating user' )
			console.log( user )
			return User.CreateNewAsync( {
				uid: user.uid,
				email: user.email ?? '',
				photoURL: user.photoURL ?? '',
				isLoggedIn: true,
				providerId: AuthProviders.Local,
				displayName
			} )
		} catch ( error ) {
			throw new Error( error )
		}
	}

	public static async CreateNewAsync( user: UserObject ): Promise<User | null> {
		if ( !user ) return null

		const userRef = firestore.doc( `${ REFERENCES.StorePath }/${ user.uid }` )
		const userSnapshot = await userRef.get()

		if ( !userSnapshot.exists ) {
			const { email, displayName, photoURL, isLoggedIn, providerId } = user

			try {
				await userRef.set( {
					isLoggedIn: isLoggedIn ?? true,
					displayName,
					email,
					photoURL: photoURL ?? '',
					providerId
				} )
			} catch ( error ) {
				console.error( error )
			}
		}

		return User.GetByIdAsync( user.uid )
	}
}
