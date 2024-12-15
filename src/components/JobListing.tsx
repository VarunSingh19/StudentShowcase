import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface JobProps {
    job: {
        id: string
        title: string
        company: string
        location: string
        description: string
        requirements: string[]
        salary: string
        applicationLink: string
    }
}

export function JobListing({ job }: JobProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.company} - {job.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-sm">
                        {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
                <Badge variant="secondary">{job.salary}</Badge>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}

