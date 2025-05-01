import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import Script from "next/script";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Disnakertrans",
	description: "Lorem ipsum dolor ci amet anjay",
	icons: {
		icon: "/pemkabGowaLogo.svg"
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
        <Script src="https://upload-widget.cloudinary.com/global/all.js"></Script>
      </head>
			<body className={poppins.className}>
				{children}
			</body>
		</html>
	);
}
