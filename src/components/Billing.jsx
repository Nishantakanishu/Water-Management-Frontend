import React, { useState, useEffect } from 'react';
import { MdReceipt, MdDownload, MdHistory, MdPayment, MdFilterList, MdClear } from 'react-icons/md';

const Billing = () => {
    // Demo Transaction Data
    const transactions = [
        { id: 1, date: "2026-01-09", description: "water Bill - Jan 2026", amount: "₹430.00", status: "Paid", statusColor: "green" },
        { id: 1, date: "2025-02-10", description: "Water Bill - Feb 2025", amount: "₹450.00", status: "Paid", statusColor: "green" },
        { id: 2, date: "2025-01-10", description: "Water Bill - Dec 2024", amount: "₹420.00", status: "Paid", statusColor: "green" },
        { id: 3, date: "2024-12-10", description: "Water Bill - Nov 2024", amount: "₹480.00", status: "Paid", statusColor: "green" },
        { id: 4, date: "2024-10-15", description: "Water Bill - Oct 2024", amount: "₹470.00", status: "Paid", statusColor: "green" },
        { id: 5, date: "2023-08-12", description: "Water Bill - Aug 2024", amount: "₹340.00", status: "Paid", statusColor: "green" },
    ];

    // State for date filtering
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    // Filter transactions based on date range
    useEffect(() => {
        if (!startDate && !endDate) {
            setFilteredTransactions(transactions);
            return;
        }

        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && end) {
                return transactionDate >= start && transactionDate <= end;
            } else if (start) {
                return transactionDate >= start;
            } else if (end) {
                return transactionDate <= end;
            }
            return true;
        });

        setFilteredTransactions(filtered);
    }, [startDate, endDate]);

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    };
    

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
             <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-stone-800">Billing & Payments</h1>
                <p className="text-sm md:text-base text-stone-500">View your current dues and transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
                {/* Current Due Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-amber-500 flex flex-col justify-between relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-stone-500 font-medium mb-1 text-sm md:text-base">Current Due Amount</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800">₹0.00</h2>
                        <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">No Dues Pending</span>
                     </div>
                     <div className="mt-6">
                        <button className="w-full bg-stone-800 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-70 flex items-center justify-center gap-2">
                             <MdPayment /> Pay Now
                        </button>
                     </div>
                     <MdReceipt className="absolute -right-4 -bottom-4 text-7xl md:text-9xl text-stone-50 opacity-10" />
                </div>

                {/* Last Payment Card */}
                <div className="bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200 flex flex-col justify-center">
                    <p className="text-stone-500 font-medium mb-1 text-sm md:text-base">Last Payment</p>
                    <h2 className="text-xl md:text-2xl font-bold text-stone-700">₹450.00</h2>
                    <p className="text-xs md:text-sm text-stone-400 mt-1">Paid on Feb 10, 2025</p>
                    <button className="mt-4 text-amber-600 text-xs md:text-sm font-semibold hover:underline flex items-center gap-1 w-fit">
                         <MdDownload /> Download Receipt
                    </button>
                </div>

                 {/* Usage Summary Card (Placeholder) */}
                 <div className="bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200 flex flex-col justify-center">
                    <p className="text-stone-500 font-medium mb-1 text-sm md:text-base">Avg. Monthly Bill</p>
                    <h2 className="text-xl md:text-2xl font-bold text-stone-700">₹450.00</h2>
                    <p className="text-xs md:text-sm text-stone-400 mt-1">Based on last 6 months</p>
                    <button className="mt-4 text-amber-600 text-xs md:text-sm font-semibold hover:underline flex items-center gap-1 w-fit">
                         View Usage Analysis
                    </button>
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MdHistory className="text-stone-400 text-xl" />
                                <h3 className="font-bold text-stone-800 text-base md:text-lg">Payment History</h3>
                            </div>
                        </div>
                        
                        {/* Date Filter Section */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 md:gap-3">
                            <div className="flex items-center gap-2">
                                <MdFilterList className="text-stone-400 hidden sm:block" />
                                <label className="text-xs md:text-sm font-medium text-stone-600 whitespace-nowrap">From:</label>
                                <input 
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="flex-1 sm:flex-none px-2 md:px-3 py-2 border border-stone-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <label className="text-xs md:text-sm font-medium text-stone-600 whitespace-nowrap">To:</label>
                                <input
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="flex-1 sm:flex-none px-2 md:px-3 py-2 border border-stone-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                />
                            </div>
                           
                            
                            {(startDate || endDate) && (
                                <button 
                                    onClick={clearFilters}
                                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                                >
                                    <MdClear size={16} />
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>
                    
                        {/* Results Count */}
                        <div className="text-xs md:text-sm text-stone-500">
                            Showing {filteredTransactions.length} of {transactions.length} transactions
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-stone-600">
                        <thead className="bg-stone-50 text-xs uppercase font-semibold text-stone-500">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-stone-50/50 transition">
                                        <td className="px-6 py-4 font-medium">{t.date}</td>
                                        <td className="px-6 py-4">{t.description}</td>
                                        <td className="px-6 py-4 text-stone-800 font-bold">{t.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                                ${t.statusColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-stone-400 hover:text-amber-600 transition">
                                                <MdDownload size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-stone-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <MdHistory className="text-4xl text-stone-300" />
                                            <p>No transactions found for the selected date range</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Billing;
