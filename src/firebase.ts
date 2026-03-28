import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, serverTimestamp, getDocs, query, orderBy, where, updateDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncUser = async (user: any, referrerCode?: string | null) => {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      let referredBy = null;

      // If a referrer code was provided, find the referrer
      if (referrerCode) {
        const q = query(collection(db, 'users'), where('referralCode', '==', referrerCode));
        const referrerSnap = await getDocs(q);
        if (!referrerSnap.empty) {
          const referrerDoc = referrerSnap.docs[0];
          referredBy = referrerDoc.id;
          
          // Increment referrer's points
          await updateDoc(doc(db, 'users', referredBy), {
            points: (referrerDoc.data().points || 0) + 1
          });
        }
      }

      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || 'Anonymous',
        email: user.email,
        photoURL: user.photoURL,
        tier: 'basic',
        joinedAt: serverTimestamp(),
        referralCode,
        points: 0,
        referredBy,
        communityConsent: false
      });
    } else {
      const data = userSnap.data();
      if (data.communityConsent === undefined) {
        await updateDoc(userRef, { communityConsent: false });
      }
    }
    const finalSnap = await getDoc(userRef);
    return finalSnap.data();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    return userSnap.data();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'users');
  }
};

export const updateUserTier = async (uid: string, tier: string) => {
  try {
    await updateDoc(doc(db, 'users', uid), { tier });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

export const updateUserConsent = async (uid: string, consent: boolean) => {
  try {
    await updateDoc(doc(db, 'users', uid), { communityConsent: consent });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

export const updateCareerProfile = async (uid: string, careerProfile: string) => {
  try {
    await updateDoc(doc(db, 'users', uid), { careerProfile });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

export const addCommunityContent = async (content: any) => {
  try {
    await addDoc(collection(db, 'content'), {
      ...content,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'content');
  }
};

export const getCommunityContent = async () => {
  try {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'content');
  }
};

export const requestConsultation = async (uid: string, name: string, email: string, message: string) => {
  try {
    await addDoc(collection(db, 'consultations'), {
      userUid: uid,
      userName: name,
      userEmail: email,
      message,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'consultations');
  }
};

export const getConsultations = async () => {
  try {
    const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'consultations');
  }
};

export const saveEntry = async (name: string, email: string) => {
  const path = 'entries';
  try {
    await addDoc(collection(db, path), {
      name,
      email,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getEntries = async () => {
  const path = 'entries';
  try {
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const saveChapterVisual = async (chapterId: string, imageUrl: string, prompt: string) => {
  const path = `chapter_visuals/${chapterId}`;
  try {
    await setDoc(doc(db, 'chapter_visuals', chapterId), {
      chapterId,
      imageUrl,
      prompt,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getChapterVisuals = async () => {
  const path = 'chapter_visuals';
  try {
    const snapshot = await getDocs(collection(db, path));
    const visuals: Record<string, { imageUrl: string }> = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      visuals[data.chapterId] = {
        imageUrl: data.imageUrl
      };
    });
    return visuals;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return {};
  }
};
