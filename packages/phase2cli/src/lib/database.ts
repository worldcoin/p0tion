/**
 * Local Firestore database helpers - bundled to ensure correct Firebase version is used.
 * These functions are copied from @p0tion/actions to avoid transitive dependency issues.
 */
import {
    collection as collectionRef,
    doc,
    DocumentData,
    DocumentSnapshot,
    Firestore,
    getDoc,
    getDocs,
    query,
    QueryConstraint,
    QueryDocumentSnapshot,
    QuerySnapshot,
    Timestamp,
    where
} from "firebase/firestore"
import { CeremonyState, FirebaseDocumentInfo, commonTerms } from "@p0tion/actions"

/**
 * Get participants collection path for database reference.
 */
export const getParticipantsCollectionPath = (ceremonyId: string): string =>
    `${commonTerms.collections.ceremonies.name}/${ceremonyId}/${commonTerms.collections.participants.name}`

/**
 * Get circuits collection path for database reference.
 */
export const getCircuitsCollectionPath = (ceremonyId: string): string =>
    `${commonTerms.collections.ceremonies.name}/${ceremonyId}/${commonTerms.collections.circuits.name}`

/**
 * Get contributions collection path for database reference.
 */
export const getContributionsCollectionPath = (ceremonyId: string, circuitId: string): string =>
    `${getCircuitsCollectionPath(ceremonyId)}/${circuitId}/${commonTerms.collections.contributions.name}`

/**
 * Get timeouts collection path for database reference.
 */
export const getTimeoutsCollectionPath = (ceremonyId: string, participantId: string): string =>
    `${getParticipantsCollectionPath(ceremonyId)}/${participantId}/${commonTerms.collections.timeouts.name}`

/**
 * Helper for query a collection based on certain constraints.
 */
export const queryCollection = async (
    firestoreDatabase: Firestore,
    collection: string,
    queryConstraints: Array<QueryConstraint>
): Promise<QuerySnapshot<DocumentData>> => {
    const q = query(collectionRef(firestoreDatabase, collection), ...queryConstraints)
    const snap = await getDocs(q)
    return snap
}

/**
 * Helper for obtaining uid and data for query document snapshots.
 */
export const fromQueryToFirebaseDocumentInfo = (
    queryDocSnap: Array<QueryDocumentSnapshot>
): Array<FirebaseDocumentInfo> =>
    queryDocSnap.map((document: QueryDocumentSnapshot<DocumentData>) => ({
        id: document.id,
        ref: document.ref,
        data: document.data()
    }))

/**
 * Fetch for all documents in a collection.
 */
export const getAllCollectionDocs = async (
    firestoreDatabase: Firestore,
    collection: string
): Promise<Array<QueryDocumentSnapshot<DocumentData>>> =>
    (await getDocs(collectionRef(firestoreDatabase, collection))).docs

/**
 * Get a specific document from database.
 */
export const getDocumentById = async (
    firestoreDatabase: Firestore,
    collection: string,
    documentId: string
): Promise<DocumentSnapshot<DocumentData>> => {
    const docRef = doc(firestoreDatabase, collection, documentId)
    return getDoc(docRef)
}

/**
 * Query for opened ceremonies.
 */
export const getOpenedCeremonies = async (firestoreDatabase: Firestore): Promise<Array<FirebaseDocumentInfo>> => {
    const runningStateCeremoniesQuerySnap = await queryCollection(
        firestoreDatabase,
        commonTerms.collections.ceremonies.name,
        [
            where(commonTerms.collections.ceremonies.fields.state, "==", CeremonyState.OPENED),
            where(commonTerms.collections.ceremonies.fields.endDate, ">=", Date.now())
        ]
    )
    return fromQueryToFirebaseDocumentInfo(runningStateCeremoniesQuerySnap.docs)
}

/**
 * Query for ceremony circuits.
 */
export const getCeremonyCircuits = async (
    firestoreDatabase: Firestore,
    ceremonyId: string
): Promise<Array<FirebaseDocumentInfo>> =>
    fromQueryToFirebaseDocumentInfo(
        await getAllCollectionDocs(firestoreDatabase, getCircuitsCollectionPath(ceremonyId))
    ).sort((a: FirebaseDocumentInfo, b: FirebaseDocumentInfo) => a.data.sequencePosition - b.data.sequencePosition)

/**
 * Query for a specific ceremony circuit contribution from a given contributor.
 */
export const getCircuitContributionsFromContributor = async (
    firestoreDatabase: Firestore,
    ceremonyId: string,
    circuitId: string,
    participantId: string
): Promise<Array<FirebaseDocumentInfo>> => {
    const participantContributionsQuerySnap = await queryCollection(
        firestoreDatabase,
        getContributionsCollectionPath(ceremonyId, circuitId),
        [where(commonTerms.collections.contributions.fields.participantId, "==", participantId)]
    )
    return fromQueryToFirebaseDocumentInfo(participantContributionsQuerySnap.docs)
}

/**
 * Query for the active timeout from given participant for a given ceremony.
 */
export const getCurrentActiveParticipantTimeout = async (
    firestoreDatabase: Firestore,
    ceremonyId: string,
    participantId: string
): Promise<Array<FirebaseDocumentInfo>> => {
    const participantTimeoutQuerySnap = await queryCollection(
        firestoreDatabase,
        getTimeoutsCollectionPath(ceremonyId, participantId),
        [where(commonTerms.collections.timeouts.fields.endDate, ">=", Timestamp.now().toMillis())]
    )
    return fromQueryToFirebaseDocumentInfo(participantTimeoutQuerySnap.docs)
}

/**
 * Query for the closed ceremonies.
 */
export const getClosedCeremonies = async (firestoreDatabase: Firestore): Promise<Array<FirebaseDocumentInfo>> => {
    const closedCeremoniesQuerySnap = await queryCollection(
        firestoreDatabase,
        commonTerms.collections.ceremonies.name,
        [
            where(commonTerms.collections.ceremonies.fields.state, "==", CeremonyState.CLOSED),
            where(commonTerms.collections.ceremonies.fields.endDate, "<=", Date.now())
        ]
    )
    return fromQueryToFirebaseDocumentInfo(closedCeremoniesQuerySnap.docs)
}

/**
 * Query all ceremonies.
 */
export const getAllCeremonies = async (firestoreDatabase: Firestore): Promise<Array<FirebaseDocumentInfo>> => {
    const ceremoniesQuerySnap = await queryCollection(firestoreDatabase, commonTerms.collections.ceremonies.name, [])
    return fromQueryToFirebaseDocumentInfo(ceremoniesQuerySnap.docs)
}
