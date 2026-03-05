import React, { useState, useEffect } from 'react';
import { MdReportProblem, MdSend, MdAttachFile, MdCheckCircle, MdPending, MdHistory } from 'react-icons/md';
import { reportAPI } from '../services/api';

const Report = () => {
    const [category, setCategory] = useState("LEAK");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [selectedComplaintId, setSelectedComplaintId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("RESOLVED");
    
    // Fetch existing tickets
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                console.log('🎫 Fetching complaint tickets...');
                console.log('🌐 API URL: http://115.124.119.161:5029/api/v1/complaints/consumer/8c83fc050068019e');
                
                const ticketsData = await reportAPI.getTickets();
                console.log('📋 Complaints API Response:', ticketsData);
                
                if (ticketsData && Array.isArray(ticketsData)) {
                    // Handle real backend response format (Axios returns the array directly from api.js)
                    const formattedTickets = ticketsData.map(ticket => ({
                        id: ticket.id,
                        complaintNumber: ticket.complaintNumber,
                        title: ticket.title,
                        description: ticket.description,
                        type: ticket.type,
                        status: ticket.status,
                        createdAt: ticket.createdAt,
                        assignedEngineerName: ticket.assignedEngineer?.fullName || ticket.assignedEngineer?.userName || ticket.assignedEngineerName,
                        acceptanceDeadline: ticket.acceptanceDeadline,
                        assignedAt: ticket.assignedAt,
                        acceptedAt: ticket.acceptedAt,
                        resolvedAt: ticket.resolvedAt,
                        escalatedAt: ticket.escalatedAt,
                        photoUrl: ticket.photoUrl,
                        priorityLevel: ticket.priorityLevel,
                        reassignmentCount: ticket.reassignmentCount,
                        consumerClosed: ticket.consumerClosed,
                        meterSerialNumber: ticket.meterSerialNumber,
                        updatedAt: ticket.updatedAt
                    }));
                    
                    setTickets(formattedTickets);
                    console.log('✅ Complaint tickets loaded:', formattedTickets);
                    console.log('✅ Total tickets:', formattedTickets.length);
                } else {
                    console.warn('No complaint tickets found');
                    console.log('📋 Full response object:', ticketsData);
                    // Set empty array - no mock data
                    setTickets([]);
                }
            } catch (err) {
                console.error('🚨 Tickets fetch error:', err);
                console.error('🚨 Full error details:', err.message);
                console.error('🚨 Error stack:', err.stack);
                setError(err.message || 'Failed to load tickets');
                // Set fallback data
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // Handle complaint status update
    const handleUpdateStatus = async () => {
        if (!selectedComplaintId) {
            setError("Please select a complaint to update");
            return;
        }

        setUpdateStatusLoading(true);
        setError(null);
        setUpdateSuccess(null);

        try {
            console.log('🔄 Updating complaint status...');
            console.log('📤 Update Data:', {
                complaintId: selectedComplaintId,
                status: selectedStatus,
                meterSerial: '8c83fc050068019e'
            });

            const response = await reportAPI.updateComplaintStatus(selectedComplaintId, selectedStatus);
            console.log('✅ Status updated:', response);

            // Extract status from API response (response is the returned object)
            const updatedStatus = response?.status || selectedStatus;
            const complaintNumber = response?.complaintNumber || `ID: ${selectedComplaintId}`;
            
            // Show professional status update message
            setUpdateSuccess(`Complaint ${complaintNumber} status successfully updated to: ${updatedStatus}`);
            
            // Update the ticket in the list with real API response data
            setTickets(prev => prev.map(ticket => 
                ticket.id == selectedComplaintId 
                    ? { 
                        ...ticket, 
                        status: updatedStatus,
                        updatedAt: response?.updatedAt || new Date().toISOString(),
                        // Update other fields from API response if available
                        ...(response && {
                            acceptanceDeadline: response.acceptanceDeadline,
                            acceptedAt: response.acceptedAt,
                            resolvedAt: response.resolvedAt,
                            escalatedAt: response.escalatedAt,
                            assignedEngineerName: response.assignedEngineer?.fullName || response.assignedEngineerName
                        })
                    }
                    : ticket
            ));
            
            // Reset selection
            setSelectedComplaintId("");
            setSelectedStatus("RESOLVED");

        } catch (err) {
            console.error('🚨 Status update error:', err);
            setError(err.message || 'Failed to update complaint status');
        } finally {
            setUpdateStatusLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('📝 Submitting complaint...');
            
            const complaintData = {
                type: category,
                title: title || `${category} Report`,
                photoUrl: photoUrl || "https://example.com/default-photo.jpg",
                description: description || "No description provided"
            };

            console.log('📤 Complaint Data:', complaintData);

            const response = await reportAPI.submitTicket(complaintData);
            console.log('✅ Complaint submitted:', response);

            if (response && response.id) {
                // Handle real backend response where response IS the ticket object
                const complaint = response;
                setSuccess(`Complaint submitted successfully! Complaint Number: ${complaint.complaintNumber || complaint.id}`);
                
                // Add new complaint to tickets list
                const newTicket = {
                    id: complaint.id,
                    complaintNumber: complaint.complaintNumber,
                    title: complaint.title,
                    description: complaint.description,
                    type: complaint.type,
                    status: complaint.status,
                    createdAt: complaint.createdAt,
                    assignedEngineerName: complaint.assignedEngineerName,
                    acceptanceDeadline: complaint.acceptanceDeadline,
                    assignedAt: complaint.assignedAt,
                    acceptedAt: complaint.acceptedAt,
                    resolvedAt: complaint.resolvedAt,
                    escalatedAt: complaint.escalatedAt,
                    photoUrl: complaint.photoUrl,
                    priorityLevel: complaint.priorityLevel,
                    reassignmentCount: complaint.reassignmentCount,
                    consumerClosed: complaint.consumerClosed,
                    meterSerialNumber: complaint.meterSerialNumber,
                    updatedAt: complaint.updatedAt
                };
                
                setTickets(prev => [newTicket, ...prev]);
                console.log('🎫 New ticket added:', newTicket);
            } else {
                setSuccess('Complaint submitted successfully!');
            }
            
            // Clear form
            setTitle("");
            setDescription("");
            setPhotoUrl("");
            setCategory("LEAK");

        } catch (err) {
            console.error('Complaint submission error:', err);
            setError(err.message || 'Failed to submit complaint');
        } finally {
            setSubmitting(false);
        }
    };

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
                    
                    {/* Success/Error Messages */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Issue Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
                            >
                                <option value="LEAK">Leakage Report</option>
                                <option value="METER_FAULT">Meter Fault</option>
                                <option value="BILLING">Billing Discrepancy</option>
                                <option value="SERVICE">Service Request</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brief title of your issue..."
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                            <textarea 
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your issue in detail..."
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700 resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Photo URL (Optional)</label>
                            <input 
                                type="text"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <MdSend /> Submit Complaint
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Update Complaint Status Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="font-bold text-lg text-stone-800 mb-4 flex items-center gap-2">
                        <MdReportProblem className="text-amber-500" />
                        Update Complaint Status
                    </h3>
                    
                    {updateSuccess && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <MdCheckCircle className="text-white text-sm" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-green-800 mb-1">Status Update Successful</h4>
                                    <p className="text-sm text-green-700">{updateSuccess}</p>
                                    <div className="mt-2 text-xs text-green-600">
                                        Updated at: {new Date().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Complaint ID</label>
                                <select 
                                    value={selectedComplaintId}
                                    onChange={(e) => setSelectedComplaintId(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
                                >
                                    <option value="">Select a complaint...</option>
                                    {tickets.map((ticket) => (
                                        <option key={ticket.id} value={ticket.id}>
                                            {ticket.complaintNumber} - {ticket.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">New Status</label>
                                <select 
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
                                >
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="ASSIGNED">ASSIGNED</option>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                    <option value="NOT_ACCEPTED">NOT_ACCEPTED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="ESCALATED">ESCALATED</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateStatus}
                            disabled={updateStatusLoading || !selectedComplaintId}
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateStatusLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating Status...
                                </>
                            ) : (
                                <>
                                    <MdCheckCircle /> Update Status
                                </>
                            )}
                        </button>
                    </div>
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
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
                                    {/* Ticket Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-stone-800 text-lg">{ticket.complaintNumber}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                                    ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                      ticket.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                                                      ticket.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                      ticket.status === 'NOT_ACCEPTED' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                      ticket.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                      ticket.status === 'ESCALATED' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                      'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                                                    {ticket.status === 'RESOLVED' && <MdCheckCircle />}
                                                    {ticket.status === 'ASSIGNED' && <MdPending />}
                                                    {ticket.status === 'ACCEPTED' && <MdCheckCircle />}
                                                    {ticket.status === 'NOT_ACCEPTED' && <MdReportProblem />}
                                                    {ticket.status === 'PENDING' && <MdPending />}
                                                    {ticket.status === 'ESCALATED' && <MdReportProblem />}
                                                    {ticket.status}
                                                </span>
                                                {ticket.updatedAt && (
                                                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                                        Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-stone-400">• {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                            {ticket.type}
                                        </span>
                                    </div>
                                    
                                    {/* Ticket Details */}
                                    <div className="space-y-2">
                                        <div>
                                            <h4 className="font-semibold text-stone-800">{ticket.title}</h4>
                                            <p className="text-sm text-stone-600 mt-1">{ticket.description}</p>
                                        </div>
                                        
                                        {/* Assigned Engineer */}
                                        {ticket.assignedEngineerName && (
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <p className="text-xs text-blue-600 font-semibold mb-1">Assigned Engineer</p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-900">{ticket.assignedEngineerName}</p>
                                                        <p className="text-xs text-blue-700">Engineer ID: {ticket.id}</p>
                                                        <p className="text-xs text-blue-700">Meter: {ticket.meterSerialNumber}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-blue-600">Assigned</p>
                                                        <p className="text-xs text-blue-800">{new Date(ticket.assignedAt).toLocaleDateString()}</p>
                                                        {ticket.acceptedAt && (
                                                            <p className="text-xs text-green-600">Accepted: {new Date(ticket.acceptedAt).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Escalated Status */}
                                        {ticket.escalatedAt && (
                                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                                <p className="text-xs text-red-600 font-semibold mb-1">Escalated</p>
                                                <p className="text-xs text-red-800">Escalated on: {new Date(ticket.escalatedAt).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        
                                        {/* Deadlines */}
                                        <div className="flex items-center gap-4 text-xs text-stone-500">
                                            {ticket.acceptanceDeadline && (
                                                <div>
                                                    <span className="font-medium">Acceptance Deadline:</span> 
                                                    <span className="ml-1">{new Date(ticket.acceptanceDeadline).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {ticket.resolvedAt && (
                                                <div>
                                                    <span className="font-medium">Resolved:</span> 
                                                    <span className="ml-1">{new Date(ticket.resolvedAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Photo */}
                                        {ticket.photoUrl && (
                                            <div className="mt-3">
                                                <a 
                                                    href={ticket.photoUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-amber-600 hover:text-amber-700 text-sm underline"
                                                >
                                                    View Photo Evidence →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {tickets.length === 0 && !loading && (
                                <div className="text-center py-8 text-stone-500">
                                    <MdReportProblem className="text-4xl mx-auto mb-2 text-stone-300" />
                                    <p>No tickets found. Submit your first complaint above!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
