import ThemeRegistry from "@/components/theme-registry/theme.registry";
import Header from "@/theme/header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <Header />
                    {/* children chính là <outlet> trong react router. Next sẽ render tất cả các thẻ con ở dây */}
                    {children}
                </ThemeRegistry>
            </body>
        </html>
    );
}
