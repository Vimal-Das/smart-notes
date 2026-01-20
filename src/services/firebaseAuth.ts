import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import type { AuthProvider, AuthResponse } from "../types";

class FirebaseAuthProvider implements AuthProvider {
    id = "google";
    name = "Google";

    async login(): Promise<AuthResponse> {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const token = await user.getIdToken();

        return {
            user: {
                id: user.uid,
                name: user.displayName || "User",
                email: user.email || "",
                picture: user.photoURL || undefined,
                provider: 'google',
                token: token
            },
            token: token
        };
    }

    async logout() {
        await signOut(auth);
    }

    onAuthChange(callback: (user: any) => void) {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdToken().then(token => {
                    callback({
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        picture: user.photoURL,
                        provider: 'google',
                        token: token
                    });
                });
            } else {
                callback(null);
            }
        });
    }
}

export const firebaseAuth = new FirebaseAuthProvider();
