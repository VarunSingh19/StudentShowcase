import React from 'react';
import { motion } from 'framer-motion';

interface MenuItem {
    href: string;
    label: string;
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg"
        >
            <div className="container mx-auto px-4 py-6 grid grid-cols-3 gap-8">
                {categories.map((category, index) => (
                    <div key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{category.name}</h3>
                        <ul className="space-y-2">
                            {category.items.map((item) => (
                                <li key={item.href}>
                                    <button
                                        onClick={() => onItemClick(item.href)}
                                        className="text-white hover:text-purple-300 transition-colors duration-300"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

