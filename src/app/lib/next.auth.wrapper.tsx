"use client";

import { SessionProvider } from "next-auth/react";

export default function NextAuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    {/* children chính là <outlet> trong react router. Next sẽ render tất cả các thẻ con ở dây */}
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
