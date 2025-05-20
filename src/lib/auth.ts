import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function handleLogin(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "akun", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("User data not found");

    await updateDoc(docRef, {
        lastAccess: serverTimestamp(),
    });

    return { user, userData: docSnap.data() };
}

export async function resetPassword(email: string) {
    return await sendPasswordResetEmail(auth, email);
}

export async function handleLogout() {
    return await signOut(auth);
}