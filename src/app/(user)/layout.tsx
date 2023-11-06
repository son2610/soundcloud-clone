import ThemeRegistry from "@/components/theme-registry/theme.registry";
import FooterPlayer from "@/theme/FooterPlayer/Footer.player";
import Header from "@/theme/header/header";
import NextAuthWrapper from "../lib/next.auth.wrapper";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <NextAuthWrapper>
                        <Header />
                        {/* children chính là <outlet> trong react router. Next sẽ render tất cả các thẻ con ở dây */}
                        {children}
                        <FooterPlayer />
                    </NextAuthWrapper>
                </ThemeRegistry>
            </body>
        </html>
    );
}
