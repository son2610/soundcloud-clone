import FooterPlayer from "@/theme/FooterPlayer/Footer.player";
import Header from "@/theme/header/header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {/* children chính là <outlet> trong react router. Next sẽ render tất cả các thẻ con ở dây */}
            {children}
            <FooterPlayer />
        </>
    );
}
