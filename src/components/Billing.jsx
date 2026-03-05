import React, { useState, useEffect } from 'react';
import { MdReceipt, MdDownload, MdPayment } from 'react-icons/md';
import { billingAPI } from '../services/api';

const Billing = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBill, setCurrentBill] = useState(null);
    const [downloadingInvoice, setDownloadingInvoice] = useState(null);
    const [showBillingHistory, setShowBillingHistory] = useState(false);
    const [billingHistory, setBillingHistory] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch current billing data
    useEffect(() => {
        const fetchCurrentBill = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('💰 Fetching current billing data...');
                console.log('🌐 API URL: http://115.124.119.161:5029/api/v1/billing/current/8c83fc050068019e');

                const currentBillData = await billingAPI.getCurrentBill();
                console.log('📄 Current Bill API Response:', currentBillData);
                console.log('📋 Full Backend Data:', JSON.stringify(currentBillData, null, 2));
                
                // Handle real backend data
                let billData = null;
                
                if (currentBillData && typeof currentBillData === 'object') {
                    if (currentBillData.data && (currentBillData.data.billNumber || currentBillData.data.amount)) {
                        billData = currentBillData.data;
                    } else if (currentBillData.billNumber || currentBillData.amount) {
                        billData = currentBillData;
                    } else {
                        throw new Error('Invalid backend response structure');
                    }
                }
                
                setCurrentBill(billData);
                
            } catch (err) {
                console.error('🚨 Current bill fetch error:', err);
                setError(err.message || 'Failed to load current bill');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentBill();
    }, []);

    const fetchBillingHistory = async () => {
        try {
            setHistoryLoading(true);
            setError(null);
            console.log('📜 Fetching billing history...');
            
            const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
            const data = await billingAPI.getPaymentHistory({
                levelName: "Meter",
                levelValue: meterSerial,
                startDate: "2025-12",
                endDate: "2026-03"
            });
            
            let historyData = [];
            if (data && data.data) {
                historyData = data.data;
            } else if (Array.isArray(data)) {
                historyData = data;
            }
            
            setBillingHistory(historyData);
            setShowBillingHistory(true);
        } catch (err) {
            console.error('🚨 Billing history fetch error:', err);
            setError(err.message || 'Failed to load billing history');
        } finally {
            setHistoryLoading(false);
        }
    };

    // Download invoice
    const handleDownloadInvoice = async (invoiceId) => {
        try {
            setDownloadingInvoice(invoiceId);
            // Simulate invoice download
            console.log('📥 Downloading invoice:', invoiceId);
            setTimeout(() => {
                setDownloadingInvoice(null);
                alert('Invoice downloaded successfully!');
            }, 2000);
        } catch (err) {
            console.error('Invoice download error:', err);
            setError('Failed to download invoice');
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-96">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                        <p className="text-stone-500">Loading billing data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-red-800 font-semibold">Error loading billing data</h3>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Billing Content */}
            {!loading && (
                <>
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-bold text-stone-800">Billing & Payments</h1>
                        <p className="text-sm md:text-base text-stone-500">View your current bill and manage payments.</p>
                    </div>

                    {/* Current Bill Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <MdReceipt className="text-amber-500" />
                                Current Bill
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                currentBill?.status === 'PAID' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-amber-100 text-amber-700'
                            }`}>
                                {currentBill?.status || 'PENDING'}
                            </span>
                        </div>

                        {currentBill ? (
                            <div className="space-y-4">
                                {/* Bill Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Bill Number:</span>
                                            <span className="font-medium">{currentBill.billNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Billing Period:</span>
                                            <span className="font-medium">
                                                {currentBill.billingPeriod || 'Current Month'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Due Date:</span>
                                            <span className="font-medium">
                                                {currentBill.dueDate ? new Date(currentBill.dueDate).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Consumer ID:</span>
                                            <span className="font-medium">{currentBill.consumerId || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Current Reading:</span>
                                            <span className="font-medium">{currentBill.currentReading || '0'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Previous Reading:</span>
                                            <span className="font-medium">{currentBill.previousReading || '0'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Consumption:</span>
                                            <span className="font-medium">{currentBill.consumption || '0'} units</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-600">Consumer Name:</span>
                                            <span className="font-medium">{currentBill.consumerName || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Breakdown */}
                                <div className="border-t border-stone-200 pt-4">
                                    <h4 className="font-semibold text-stone-700 mb-3">💰 Cost Breakdown</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-600">Water Charges:</span>
                                            <span className="font-medium">{formatCurrency(currentBill.waterCharges || 0)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-600">Sewerage Charges:</span>
                                            <span className="font-medium">{formatCurrency(currentBill.sewerageCharges || 0)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-600">Taxes:</span>
                                            <span className="font-medium">{formatCurrency(currentBill.taxes || 0)}</span>
                                        </div>
                                        {currentBill.otherCharges && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-stone-600">Other Charges:</span>
                                                <span className="font-medium">{formatCurrency(currentBill.otherCharges)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-stone-200">
                                            <span>Total Amount:</span>
                                            <span className="text-amber-600">{formatCurrency(currentBill.amount || 0)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Backend Info */}
                                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-stone-700 mb-2">📊 Additional Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {currentBill.mobileNumber && (
                                            <div className="flex justify-between">
                                                <span className="text-stone-600">Mobile Number:</span>
                                                <span className="font-medium">{currentBill.mobileNumber}</span>
                                            </div>
                                        )}
                                        {currentBill.address && (
                                            <div className="flex justify-between">
                                                <span className="text-stone-600">Address:</span>
                                                <span className="font-medium">{currentBill.address}</span>
                                            </div>
                                        )}
                                        {currentBill.meterSerialNumber && (
                                            <div className="flex justify-between">
                                                <span className="text-stone-600">Meter Serial:</span>
                                                <span className="font-medium">{currentBill.meterSerialNumber}</span>
                                            </div>
                                        )}
                                        {currentBill.zone && (
                                            <div className="flex justify-between">
                                                <span className="text-stone-600">Zone:</span>
                                                <span className="font-medium">{currentBill.zone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => handleDownloadInvoice(currentBill.billNumber)}
                                        disabled={downloadingInvoice === currentBill.billNumber}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                                    >
                                        {downloadingInvoice === currentBill.billNumber ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <MdDownload />
                                                Download Invoice
                                            </>
                                        )}
                                    </button>
                                    {currentBill.status !== 'PAID' && (
                                        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                            <MdPayment />
                                            Pay Now
                                        </button>
                                    )}
                                    <button
                                        onClick={fetchBillingHistory}
                                        disabled={historyLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        {historyLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <MdReceipt />
                                                Billing History
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-stone-500">
                                <MdReceipt className="text-4xl mx-auto mb-2 text-stone-300" />
                                <p>No current bill information available</p>
                            </div>
                        )}

                        {/* Billing History Section */}
                        {showBillingHistory && (
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                        <MdReceipt className="text-blue-500" />
                                        Billing History
                                    </h2>
                                    <button
                                        onClick={() => setShowBillingHistory(false)}
                                        className="text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {billingHistory && billingHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {billingHistory.map((bill, index) => (
                                            <div key={index} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-xs text-stone-500 mb-1">Bill Number</p>
                                                        <p className="font-semibold text-stone-800">{bill.billNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-stone-500 mb-1">Period</p>
                                                        <p className="font-medium text-stone-700">{bill.billingPeriod}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-stone-500 mb-1">Amount</p>
                                                        <p className="font-bold text-amber-600">₹{bill.amount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-stone-500 mb-1">Status</p>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                            bill.status === 'PAID' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {bill.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 pt-4 border-t border-stone-100">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-600">Due Date:</span>
                                                            <span className="font-medium">
                                                                {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-600">Paid Date:</span>
                                                            <span className="font-medium">
                                                                {bill.paidDate ? new Date(bill.paidDate).toLocaleDateString() : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-600">Consumption:</span>
                                                            <span className="font-medium">{bill.consumption || 0} units</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-500">Water:</span>
                                                            <span>₹{bill.waterCharges || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-500">Sewerage:</span>
                                                            <span>₹{bill.sewerageCharges || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-500">Taxes:</span>
                                                            <span>₹{bill.taxes || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-stone-500">Readings:</span>
                                                            <span>{bill.previousReading || 0} → {bill.currentReading || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-stone-500">
                                        <MdReceipt className="text-4xl mx-auto mb-2 text-stone-300" />
                                        <p>No billing history available</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-stone-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-600 mb-1">Current Month's Usage</p>
                                    <p className="text-2xl font-bold text-stone-800">
                                        {currentBill?.consumption || '0'} units
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MdReceipt className="text-blue-500 text-xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-stone-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-600 mb-1">Current Balance</p>
                                    <p className="text-2xl font-bold text-amber-600">
                                        {formatCurrency(currentBill?.amount || 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <MdPayment className="text-amber-500 text-xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-stone-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-600 mb-1">Payment Status</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {currentBill?.status || 'PENDING'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <MdPayment className="text-green-500 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Billing;
