import ThemeRegistry from "@/components/theme-registry/theme.registry";
import NextAuthWrapper from "./lib/next.auth.wrapper";
import { ToastProvider } from "@/utils/toast";
import { TrackContextProvider } from "./lib/track.wrapper";
import NProgressWrapper from "./lib/nprogress.wrapper";

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
                        {/* children chính là <outlet> trong react router. Next sẽ render tất cả các thẻ con ở dây */}
                        <ToastProvider>
                            <TrackContextProvider>
                                <NProgressWrapper>{children}</NProgressWrapper>
                            </TrackContextProvider>
                        </ToastProvider>
                    </NextAuthWrapper>
                </ThemeRegistry>
            </body>
        </html>
    );
}
