import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { firebaseConfig } from '../../../package.json'

firebase.initializeApp( firebaseConfig )

export const auth = firebase.auth()

export const firestore = firebase.firestore()

export const { serverTimestamp } = firebase.firestore.FieldValue

const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const SignIn = {
	WithEmail: ( email: string, password: string ) => auth.signInWithEmailAndPassword( email, password ),
	WithGoogle: () => auth.signInWithPopup( googleAuthProvider )
}
