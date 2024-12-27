
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import * as Icons from 'lucide-react'
import fieldsAndPaths from '@/app/data/fields-and-paths.json'

type Field = typeof fieldsAndPaths.fields[0]
export type Path = Field['paths'][0]

interface PathSelectionProps {
    onSelect: (field: string, path: { id: string; name: string; icon: string; }) => void;
}

export function PathSelection({ onSelect }: PathSelectionProps) {
    const [selectedField, setSelectedField] = useState<Field | null>(null)
    const [selectedPath, setSelectedPath] = useState<Path | null>(null)

    const handleFieldSelect = (field: Field) => {
        setSelectedField(field)
        setSelectedPath(null)
    }

    const handlePathSelect = (path: Path) => {
        setSelectedPath(path)
    }

    const handleSubmit = () => {
        if (selectedField && selectedPath) {
            onSelect(selectedField.id, selectedPath) // Pass the full path object
        }
    }

    const renderIcon = (iconName: string) => {
        const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
        if (!Icon) {
            console.warn(`Icon "${iconName}" not found in lucide-react.`);
            return null;
        }
        return <Icon className="w-12 h-12 mb-4" />;
    };



    return (
        <Card className="w-full  mx-auto">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-t-lg">
                <CardTitle className="text-3xl font-bold">Choose Your Area Of Interest</CardTitle>
                <CardDescription className="text-indigo-100">
                    {selectedField ? 'Select a specific path' : 'Select your field of interest'}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {!selectedField ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fieldsAndPaths.fields.map((field) => (
                            <motion.div key={field.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card
                                    className={`cursor-pointer transition-all ${field.color}`}
                                    onClick={() => handleFieldSelect(field)}
                                >
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        {renderIcon(field.icon)}
                                        <h3 className={`text-xl font-semibold ${field.textColor}`}>{field.name}</h3>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedField.paths.map((path) => (
                                <motion.div key={path.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Card
                                        className={`cursor-pointer transition-all ${selectedField.color} ${selectedPath?.id === path.id ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                                            }`}
                                        onClick={() => handlePathSelect(path)}
                                    >
                                        <CardContent className="p-6 flex flex-col items-center text-center">
                                            {renderIcon(path.icon)}
                                            <h3 className={`text-xl font-semibold ${selectedField.textColor}`}>{path.name}</h3>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-between">
                            <Button onClick={() => setSelectedField(null)} variant="outline">
                                Back to Fields
                            </Button>
                            <Button onClick={handleSubmit} disabled={!selectedPath}>
                                Start Assessment
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
