import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FilterProps {
    filter: {
        role: string
        location: string
        experienceLevel: string
    }
    setFilter: React.Dispatch<React.SetStateAction<{
        role: string
        location: string
        experienceLevel: string
    }>>
}

export function JobFilter({ filter, setFilter }: FilterProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <div>
                <Label htmlFor="role">Role</Label>
                <Input
                    id="role"
                    placeholder="e.g. Software Engineer"
                    value={filter.role}
                    onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                />
            </div>
            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    placeholder="e.g. New York"
                    value={filter.location}
                    onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                />
            </div>
            <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                    value={filter.experienceLevel}
                    onValueChange={(value) => setFilter({ ...filter, experienceLevel: value })}
                >
                    <SelectTrigger id="experienceLevel">
                        <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

