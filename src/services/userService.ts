
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, Timestamp, setDoc, updateDoc } from 'firebase/firestore';
import { ConditionResult } from '@/pages/SymptomChecker';
import { toast } from '@/lib/toast';

export interface UserSymptomHistory {
  id?: string;
  userId: string;
  date: Timestamp;
  symptoms: string[];
  results: ConditionResult[];
}

export interface UserDietHistory {
  id?: string;
  userId: string;
  date: Timestamp;
  healthProfile: any; // Type according to your diet suggestion structure
  dietPlan: any; // Type according to your diet plan structure
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt: Timestamp;
}

// Save symptom check result to history
export const saveSymptomHistory = async (
  userId: string,
  symptoms: string[],
  results: ConditionResult[]
): Promise<string> => {
  try {
    const historyRef = await addDoc(collection(db, 'symptomHistory'), {
      userId,
      date: Timestamp.now(),
      symptoms,
      results
    });
    return historyRef.id;
  } catch (error) {
    console.error('Error saving symptom history:', error);
    throw error;
  }
};

// Save diet suggestion to history
export const saveDietHistory = async (
  userId: string,
  healthProfile: any,
  dietPlan: any
): Promise<string> => {
  try {
    const historyRef = await addDoc(collection(db, 'dietHistory'), {
      userId,
      date: Timestamp.now(),
      healthProfile,
      dietPlan
    });
    return historyRef.id;
  } catch (error) {
    console.error('Error saving diet history:', error);
    throw error;
  }
};

// Get user's symptom history
export const getUserSymptomHistory = async (userId: string): Promise<UserSymptomHistory[]> => {
  try {
    // Try with orderBy first (requires composite index)
    const q = query(
      collection(db, 'symptomHistory'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserSymptomHistory[];
  } catch (error) {
    console.error('Error fetching symptom history:', error);
    
    // If index error occurs, fallback to just fetching without ordering
    if (error instanceof Error && error.message.includes('index')) {
      try {
        toast.info('Creating optimal data view. Please visit Firebase console to create the suggested index.');
        const fallbackQuery = query(
          collection(db, 'symptomHistory'),
          where('userId', '==', userId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        // Sort in memory instead
        const results = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserSymptomHistory[];
        
        return results.sort((a, b) => b.date.seconds - a.date.seconds);
      } catch (fallbackError) {
        console.error('Fallback query failed:', fallbackError);
        return [];
      }
    }
    
    return [];
  }
};

// Get user's diet history
export const getUserDietHistory = async (userId: string): Promise<UserDietHistory[]> => {
  try {
    // Try with orderBy first (requires composite index)
    const q = query(
      collection(db, 'dietHistory'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserDietHistory[];
  } catch (error) {
    console.error('Error fetching diet history:', error);
    
    // If index error occurs, fallback to just fetching without ordering
    if (error instanceof Error && error.message.includes('index')) {
      try {
        toast.info('Creating optimal data view. Please visit Firebase console to create the suggested index.');
        const fallbackQuery = query(
          collection(db, 'dietHistory'),
          where('userId', '==', userId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        // Sort in memory instead
        const results = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserDietHistory[];
        
        return results.sort((a, b) => b.date.seconds - a.date.seconds);
      } catch (fallbackError) {
        console.error('Fallback query failed:', fallbackError);
        return [];
      }
    }
    
    return [];
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'userProfiles', userId));
    
    if (userDoc.exists()) {
      return { userId, ...userDoc.data() } as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Create or update user profile
export const updateUserProfile = async (
  userId: string,
  profileData: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(userRef, {
        ...profileData,
        createdAt: Timestamp.now()
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, profileData);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
