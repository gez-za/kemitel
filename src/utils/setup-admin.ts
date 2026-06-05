import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const setupAdminUser = async () => {
  const adminEmail = "admin@kemitel.com";
  const adminPassword = "AdminPassword123!";

  console.log("Checking if admin agent exists...");
  
  try {
    // 1. Try to create or find auth user
    let uid = "";
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      uid = userCredential.user.uid;
      console.log("Admin auth created.");
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        // We can't easily get the UID without logging in, 
        // but we can try to sign in just to get the UID for this setup script
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        uid = userCredential.user.uid;
        console.log("Admin auth already exists, UID retrieved via login.");
      } else {
        throw err;
      }
    }

    if (uid) {
      // 2. Ensure profile is in AGENTS collection
      const agentRef = doc(db, "agents", uid);
      const agentSnap = await getDoc(agentRef);

      if (!agentSnap.exists()) {
        await setDoc(agentRef, {
          uid: uid,
          email: adminEmail,
          displayName: "Administrator",
          role: "agent_hotline",
          agentCode: "ADM-001",
          department: "Administration",
          isAvailable: true,
          createdAt: serverTimestamp()
        });
        console.log("Administrator Agent profile created in AGENTS collection.");
        
        // 3. Optional: Remove from 'users' collection if it was there
        // This is safe to attempt
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // Note: We don't have deleteDoc imported, but we could. 
          // For now, let's just leave it or overwrite it.
        }
      } else {
        console.log("Administrator Agent profile already exists in AGENTS.");
      }
    }
  } catch (error: any) {
    console.warn("setupAdminUser notice:", error.message);
  }
};
