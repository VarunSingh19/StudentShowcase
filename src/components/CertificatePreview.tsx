import React from 'react'
import Image from 'next/image'

interface CertificatePreviewProps {
    projectName: string
    recipientName: string
    techStack: string
    completionDate: string
}

export function CertificatePreview({ projectName, recipientName, techStack, completionDate }: CertificatePreviewProps) {
    return (
        <div className="aspect-[1.414] w-full bg-white border-4 border-blue-200 p-8 relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-blue-600" />

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                    Certificate of Achievement
                </h2>

                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <p className="text-gray-600 text-lg">This certifies that</p>

                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                        {recipientName}
                    </p>

                    <p className="text-gray-600 text-lg">
                        has successfully completed the project
                    </p>

                    <p className="text-xl md:text-2xl font-bold text-blue-600">
                        {projectName}
                    </p>

                    <div className="space-y-2">
                        <p className="text-gray-600">demonstrating proficiency in:</p>
                        <p className="text-lg font-semibold text-blue-600">{techStack}</p>
                    </div>

                    <p className="text-sm text-gray-500 mt-8">
                        Completed on: {completionDate}
                    </p>
                </div>
            </div>

            {/* <div className="absolute bottom-8 left-8">
                <Image src="/placeholder.svg?height=60&width=120" alt="Logo" width={120} height={60} />
            </div> */}
            <div className="absolute bottom-8 right-8 text-right">
                <div className="font-italic text-2xl text-gray-700 mb-2">Varun Singh</div>
                <div className="text-sm text-gray-500">Founder, StudentShowcase</div>
            </div>
            <div className="absolute bottom-8 left-24">
                <Image src="/qrcode.png?height=80&width=80" alt="QR Code" width={80} height={80} />
            </div>

            <div className="absolute inset-3 border-2 border-blue-200 pointer-events-none" />
        </div>
    )
}

