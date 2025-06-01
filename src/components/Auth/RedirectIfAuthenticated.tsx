"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const docSnap = await getDoc(doc(db, "akun", user.uid));
				if (docSnap.exists()) {
					const userData = docSnap.data();
					if (userData.role === "disnaker") {
						router.push("/dashboard/disnaker");
					} else if (userData.role === "lpk") {
						router.push(`/dashboard/lpk/${userData.lpkId}`);
					}
				}
			} else {
				setChecking(false);
			}
		});

		return () => unsubscribe();
	}, [router]);

	if (checking) return null;

	return (
		<>
			{children}
		</>
	);
}