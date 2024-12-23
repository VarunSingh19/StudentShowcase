import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface MenuItem {
    href?: string;
    label: string;
    subItems?: MenuItem[];
}

interface MenuCategory {
    name: string;
    items: MenuItem[];
}

interface MegaMenuProps {
    categories: MenuCategory[];
    onItemClick: (href: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ categories, onItemClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg"
        >
            <div className="container mx-auto py-4 grid grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <div key={index}>
                        <h3 className="text-lg font-semibold text-purple-400 mb-1">{category.name}</h3>
                        <ul className="space-y-1">
                            {category.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    {item.subItems ? (
                                        <div className="group relative">
                                            <button className="text-white hover:text-purple-300 transition-colors duration-300 flex items-center">
                                                {item.label}
                                                <ChevronRight className="ml-1" size={16} />
                                            </button>
                                            <ul className="absolute left-full top-0 bg-gray-800 p-2 rounded-md shadow-md hidden group-hover:block">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <button
                                                            onClick={() => onItemClick(subItem.href!)}
                                                            className="text-white hover:text-purple-300 transition-colors duration-300 block py-1"
                                                        >
                                                            {subItem.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onItemClick(item.href!)}
                                            className="text-white hover:text-purple-300 transition-colors duration-300"
                                        >
                                            {item.label}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

