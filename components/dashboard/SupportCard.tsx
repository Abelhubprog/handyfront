import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const SupportCard = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">Need help?</h3>
            <p className="text-sm text-blue-800/70 mb-4 leading-relaxed">
                Our support team is available 24/7 to help with your orders or account questions.
            </p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 bg-white" onClick={() => navigate('/app/messages')}>
                Chat with Support
            </Button>
        </div>
    );
};