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
import {
    CeremonyState,
    FirebaseDocumentInfo,
    commonTerms,
    ContributionValidity,
    Contribution,
    finalContributionIndex
} from "@p0tion/actions"

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

/**
 * Get the validity of contributors' contributions for each circuit of the given ceremony.
 */
export const getContributionsValidityForContributor = async (
    firestoreDatabase: Firestore,
    circuits: Array<FirebaseDocumentInfo>,
    ceremonyId: string,
    participantId: string,
    isFinalizing: boolean
): Promise<Array<ContributionValidity>> => {
    const contributionsValidity: Array<ContributionValidity> = []

    for await (const circuit of circuits) {
        const circuitContributionsFromContributor = await getCircuitContributionsFromContributor(
            firestoreDatabase,
            ceremonyId,
            circuit.id,
            participantId
        )

        const contribution = isFinalizing
            ? circuitContributionsFromContributor
                  .filter(
                      (contributionDocument: FirebaseDocumentInfo) =>
                          contributionDocument.data.zkeyIndex === finalContributionIndex
                  )
                  .at(0)
            : circuitContributionsFromContributor.at(0)

        if (!contribution)
            throw new Error(
                "Unable to retrieve contributions for the participant. There may have occurred a database-side error. Please, we kindly ask you to terminate the current session and repeat the process"
            )

        contributionsValidity.push({
            contributionId: contribution?.id,
            circuitId: circuit.id,
            valid: contribution?.data.valid
        })
    }

    return contributionsValidity
}

/**
 * Return the public attestation preamble for given contributor.
 */
export const getPublicAttestationPreambleForContributor = (
    contributorIdentifier: string,
    ceremonyName: string,
    isFinalizing: boolean
) =>
    `Hey, I'm ${contributorIdentifier} and I have ${isFinalizing ? "finalized" : "contributed to"} the ${ceremonyName}${
        ceremonyName.toLowerCase().includes("trusted setup") || ceremonyName.toLowerCase().includes("ceremony")
            ? "."
            : " MPC Phase2 Trusted Setup ceremony."
    }\nThe following are my contribution signatures:`

/**
 * Check and prepare public attestation for the contributor made only of its valid contributions.
 */
export const generateValidContributionsAttestation = async (
    firestoreDatabase: Firestore,
    circuits: Array<FirebaseDocumentInfo>,
    ceremonyId: string,
    participantId: string,
    participantContributions: Array<Contribution>,
    contributorIdentifier: string,
    ceremonyName: string,
    isFinalizing: boolean
): Promise<string> => {
    let publicAttestation = getPublicAttestationPreambleForContributor(
        contributorIdentifier,
        ceremonyName,
        isFinalizing
    )

    const contributionsWithValidity = await getContributionsValidityForContributor(
        firestoreDatabase,
        circuits,
        ceremonyId,
        participantId,
        isFinalizing
    )

    for await (const contributionWithValidity of contributionsWithValidity) {
        const matchedContributions = participantContributions.filter(
            (contribution: Contribution) => contribution.doc === contributionWithValidity.contributionId
        )

        if (matchedContributions.length === 0)
            throw new Error(
                `Unable to retrieve given circuit contribution information. This could happen due to some errors while writing the information on the database.`
            )

        if (matchedContributions.length > 1)
            throw new Error(`Duplicated circuit contribution information. Please, contact the coordinator.`)

        const participantContribution = matchedContributions.at(0)!

        const circuitDocument = await getDocumentById(
            firestoreDatabase,
            getCircuitsCollectionPath(ceremonyId),
            contributionWithValidity.circuitId
        )
        const contributionDocument = await getDocumentById(
            firestoreDatabase,
            getContributionsCollectionPath(ceremonyId, contributionWithValidity.circuitId),
            participantContribution.doc
        )

        if (!contributionDocument.data() || !circuitDocument.data())
            throw new Error(`Something went wrong when retrieving the data from the database`)

        const { sequencePosition, prefix } = circuitDocument.data()!
        const { zkeyIndex } = contributionDocument.data()!

        publicAttestation = `${publicAttestation}\n\nCircuit # ${sequencePosition} (${prefix})\nContributor # ${
            zkeyIndex > 0 ? Number(zkeyIndex) : zkeyIndex
        }\n${participantContribution.hash}`
    }

    return publicAttestation
}
