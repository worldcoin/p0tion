/**
 * Local Firebase helpers - bundled to ensure correct firebase version is used.
 * These functions are copied from @p0tion/actions to avoid transitive dependency issues.
 */
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app"
import { Firestore, getFirestore } from "firebase/firestore"
import { Functions, getFunctions } from "firebase/functions"
import { User, getAuth, signInWithCredential, OAuthCredential } from "firebase/auth"

export interface FirebaseServices {
    firebaseApp: FirebaseApp
    firestoreDatabase: Firestore
    firebaseFunctions: Functions
}

/**
 * Initialize a Firebase app.
 */
const initializeFirebaseApp = (options: FirebaseOptions): FirebaseApp => initializeApp(options)

/**
 * Get Firestore database instance.
 */
const getFirestoreDatabase = (app: FirebaseApp): Firestore => getFirestore(app)

/**
 * Get Cloud Functions instance.
 */
const getFirebaseFunctions = (app: FirebaseApp): Functions => getFunctions(app, "europe-west1")

/**
 * Return the core Firebase services instances (App, Database, Functions).
 */
export const initializeFirebaseCoreServices = async (
    apiKey: string,
    authDomain: string,
    projectId: string,
    messagingSenderId: string,
    appId: string
): Promise<FirebaseServices> => {
    const firebaseApp = initializeFirebaseApp({
        apiKey,
        authDomain,
        projectId,
        messagingSenderId,
        appId
    })
    const firestoreDatabase = getFirestoreDatabase(firebaseApp)
    const firebaseFunctions = getFirebaseFunctions(firebaseApp)

    return {
        firebaseApp,
        firestoreDatabase,
        firebaseFunctions
    }
}

/**
 * Sign in w/ OAuth 2.0 token.
 */
export const signInToFirebaseWithCredentials = async (firebaseApp: FirebaseApp, credentials: OAuthCredential) =>
    signInWithCredential(getAuth(firebaseApp), credentials)

/**
 * Return the current authenticated user.
 */
export const getCurrentFirebaseAuthUser = (firebaseApp: FirebaseApp): User => {
    const user = getAuth(firebaseApp).currentUser

    if (!user)
        throw new Error(
            `Unable to find the user currently authenticated with Firebase. Verify that the Firebase application is properly configured and repeat user authentication before trying again.`
        )

    return user
}
