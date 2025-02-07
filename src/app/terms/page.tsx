'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
                                <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">2. Description of Service</h2>
                                <p>StudentShowcase provides a platform for students to showcase their projects, connect with peers, and explore opportunities. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">3. Registration</h2>
                                <p>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">4. User Conduct</h2>
                                <p>You agree not to use the service to:</p>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.</li>
                                    <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                                    <li>Upload or transmit any material that infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
                                    <li>Interfere with or disrupt the service or servers or networks connected to the service.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">5. Content</h2>
                                <p>You retain all ownership rights to your content. However, by submitting content to StudentShowcase, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, and display such content in connection with the service.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">6. Privacy</h2>
                                <p>Please review our Privacy Policy, which also governs your visit to StudentShowcase, to understand our practices regarding the collection and use of your personal information.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">7. Termination</h2>
                                <p>We may terminate your access to the service, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">8. Changes to Terms</h2>
                                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">9. Contact</h2>
                                <p>If you have any questions about these Terms, please contact us at support@studentshowcase.com.</p>
                            </section>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

