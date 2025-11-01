import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "@/lib/firebase";

interface UserData {
  uid: string;
  email: string;
  role: "owner" | "customer";
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, role: "owner" | "customer") => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (role?: "owner" | "customer") => Promise<UserData | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  async function getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  async function createUserData(uid: string, email: string, role: "owner" | "customer") {
    const userData: UserData = {
      uid,
      email,
      role,
    };
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: new Date().toISOString(),
    });
    return userData;
  }

  async function signup(email: string, password: string, role: "owner" | "customer") {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = await createUserData(userCredential.user.uid, email, role);
    setUserData(userData);
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserData(userCredential.user.uid);
    setUserData(userData);
  }

  async function loginWithGoogle(role?: "owner" | "customer"): Promise<UserData | null> {
    const userCredential = await signInWithPopup(auth, provider);
    let userData = await getUserData(userCredential.user.uid);
    
    if (!userData && role) {
      userData = await createUserData(
        userCredential.user.uid,
        userCredential.user.email || "",
        role
      );
    }
    
    setUserData(userData);
    return userData;
  }

  async function logout() {
    await signOut(auth);
    setUserData(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
