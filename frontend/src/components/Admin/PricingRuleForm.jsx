import React, { useState, useEffect } from 'react';
// Assuming you have an admin service layer for API calls
import { createPricingRule, fetchPricingRules } from '../../services/adminService'; 

const initialRuleState = {
    name: '',
    type: 'MULTIPLIER', // Default type
    value: 1, // 1.5 for multiplier, 5 for surcharge, etc.
    appliesTo: 'COURT', // COURT, COACH, EQUIPMENT
    startHour: 18,
    endHour: 21,
    dayOfWeek: [], // Array of numbers (0=Sun, 1=Mon, etc.)
    isActive: true
};

const ruleTypes = ['MULTIPLIER', 'SURCHARGE', 'FLAT_FEE'];
const applyTargets = ['COURT', 'COACH', 'EQUIPMENT'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function PricingRuleForm() {
    const [rule, setRule] = useState(initialRuleState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [existingRules, setExistingRules] = useState([]); // To display list of existing rules

    // Fetch existing rules on load
    useEffect(() => {
        fetchExistingRules();
    }, []);

    const fetchExistingRules = () => {
        fetchPricingRules().then(setExistingRules).catch(err => console.error("Failed to fetch rules:", err));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRule(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleDayChange = (e) => {
        const dayIndex = parseInt(e.target.value);
        setRule(prev => {
            const currentDays = prev.dayOfWeek;
            if (currentDays.includes(dayIndex)) {
                return { ...prev, dayOfWeek: currentDays.filter(day => day !== dayIndex) };
            } else {
                return { ...prev, dayOfWeek: [...currentDays, dayIndex].sort((a,b) => a-b) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await createPricingRule(rule);
            setMessage({ type: 'success', text: 'Pricing Rule created successfully!' });
            setRule(initialRuleState);
            fetchExistingRules(); // Refresh list
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to create rule: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    // 

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create New Pricing Rule</h2>
            
            {message && (
                <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rule Name */}
                <label className="block">
                    Rule Name:
                    <input type="text" name="name" value={rule.name} onChange={handleChange} required className="w-full p-2 border rounded" />
                </label>

                {/* Type Selector */}
                <div className="flex space-x-4">
                    <label className="block flex-1">
                        Rule Type:
                        <select name="type" value={rule.type} onChange={handleChange} className="w-full p-2 border rounded">
                            {ruleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </label>
                    <label className="block flex-1">
                        Value ({rule.type === 'MULTIPLIER' ? 'Factor' : 'Amount ($)'}):
                        <input type="number" name="value" value={rule.value} onChange={handleChange} required step={rule.type === 'MULTIPLIER' ? 0.01 : 1} min={rule.type === 'MULTIPLIER' ? 1 : 0} className="w-full p-2 border rounded" />
                    </label>
                </div>

                {/* Applies To */}
                <label className="block">
                    Applies To:
                    <select name="appliesTo" value={rule.appliesTo} onChange={handleChange} required className="w-full p-2 border rounded">
                        {applyTargets.map(target => <option key={target} value={target}>{target}</option>)}
                    </select>
                </label>

                {/* Time Constraints */}
                <div className="flex space-x-4">
                    <label className="block flex-1">
                        Start Hour (0-23):
                        <input type="number" name="startHour" value={rule.startHour} onChange={handleChange} min="0" max="23" className="w-full p-2 border rounded" />
                    </label>
                    <label className="block flex-1">
                        End Hour (0-23):
                        <input type="number" name="endHour" value={rule.endHour} onChange={handleChange} min="0" max="23" className="w-full p-2 border rounded" />
                    </label>
                </div>
                
                {/* Day of Week Selector */}
                <div className="block">
                    Day(s) of Week:
                    <div className="flex flex-wrap gap-2 mt-1">
                        {days.map((day, index) => (
                            <label key={index} className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={index}
                                    checked={rule.dayOfWeek.includes(index)}
                                    onChange={handleDayChange}
                                />
                                <span className="text-sm">{day.substring(0, 3)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                    {loading ? 'Saving Rule...' : 'Save Pricing Rule'}
                </button>
            </form>

            {/* Display Existing Rules */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Existing Rules</h3>
                {existingRules.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                        {existingRules.map(r => (
                            <li key={r._id} className="p-2 border rounded bg-gray-50">
                                **{r.name}** ({r.type} {r.value}) applied to {r.appliesTo} 
                                {r.dayOfWeek.length > 0 && ` on ${r.dayOfWeek.map(d => days[d].substring(0, 3)).join(', ')}`}
                            </li>
                        ))}
                    </ul>
                ) : <p>No pricing rules defined yet.</p>}
            </div>
        </div>
    );
}

export default PricingRuleForm;