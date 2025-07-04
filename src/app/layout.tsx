import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Disnakertrans Gowa",
	description: "Website resmi Dinas Tenaga Kerja dan Transmigrasi (Disnakertrans) Kabupaten Gowa.",
	robots: 'index, follow',
  	viewport: 'width=device-width, initial-scale=1.0',
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
		<html lang="id">
			<body className={poppins.className}>
				{children}
			</body>
		</html>
	);
}