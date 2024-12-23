import React from 'react';
import { Check, Circle } from 'lucide-react';

interface OrderTimelineProps {
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStep = steps.indexOf(status);

    const getStepStyle = (index: number) => {
        if (index <= currentStep) {
            return "bg-purple-600"; // completed or current step
        }
        return "bg-gray-200"; // upcoming step
    };

    return (
        <div className="w-full">
            <div className="relative flex items-center justify-between">
                {/* Progress Line */}
                <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 w-full bg-gray-200">
                    <div
                        className="h-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                {steps.map((step, index) => (
                    <div key={step} className="relative flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepStyle(index)} transition-colors duration-300`}>
                            {index <= currentStep ? (
                                <Check className="w-5 h-5 text-white" />
                            ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${index <= currentStep ? 'text-purple-600' : 'text-gray-500'
                            } capitalize`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;