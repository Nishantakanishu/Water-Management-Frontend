import React, { useState } from 'react';
import { MdReportProblem, MdSend, MdAttachFile, MdCheckCircle, MdPending } from 'react-icons/md';

const Report = () => {
    const [category, setCategory] = useState("Meter Fault");
    
    const tickets = [
        { id: "#TKT-9921", date: "Jan 15, 2025", issue: "Bill Discrepancy", status: "Resolved", color: "green" },
        { id: "#TKT-9840", date: "Dec 02, 2024", issue: "Meter Display Error", status: "Closed", color: "stone" },
        { id: "#TKT-9320", date: "Oct 12, 2025", issue: "Meter Display Error", status: "Closed", color: "stone" },
    ];

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
             <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-stone-800">Report an Issue</h1>
                <p className="text-sm md:text-base text-stone-500">Raise a ticket for meter faults, billing errors, or other concerns.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                {/* Report Form */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="font-bold text-base md:text-lg text-stone-800 mb-6 flex items-center gap-2">
                        <MdReportProblem className="text-amber-500" /> New Grievance
                    </h3>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Issue Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
                            >
                                <option>Meter Fault</option>
                                <option>Billing Discrepancy</option>
                                <option>Leakage Report</option>
                                <option>Service Request</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                            <textarea 
                                rows="4"
                                placeholder="Describe your issue in detail..."
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700 resize-none"
                            ></textarea>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-stone-700 mb-1">Attachment (Optional)</label>
                             <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:bg-stone-50 transition cursor-pointer">
                                 <MdAttachFile className="mx-auto text-2xl text-stone-400 mb-2" />
                                 <p className="text-sm text-stone-500">Click to upload photo or document</p>
                             </div>
                        </div>

                        <button type="button" className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-amber-600 transition flex items-center justify-center gap-2">
                            <MdSend /> Submit Ticket
                        </button>
                    </form>
                </div>

                {/* Recent Tickets Section */}
                <div className="space-y-6">
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                        <h4 className="font-bold text-stone-800 mb-2">Need Help Immediately?</h4>
                        <p className="text-sm text-stone-600 mb-4">For urgent water leakage or hazardous situations, please call our 24/7 helpline.</p>
                        <div className="text-2xl font-bold text-amber-600">1800-123-4567</div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-stone-800 mb-4 ml-1">Recent Tickets</h3>
                        <div className="space-y-4">
                            {tickets.map((t, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-stone-800">{t.id}</span>
                                            <span className="text-xs text-stone-400">• {t.date}</span>
                                        </div>
                                        <p className="text-sm text-stone-600 font-medium">{t.issue}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                        ${t.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'}`}>
                                        {t.color === 'green' ? <MdCheckCircle /> : <MdPending />}
                                        {t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {tickets.length === 0 && (
                             <p className="text-center text-stone-400 py-10">No recent tickets found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
