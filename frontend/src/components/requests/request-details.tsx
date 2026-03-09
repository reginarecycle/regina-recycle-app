import { X, MapPin, Check, XCircle } from 'lucide-react';
import ProfilePhoto from "@/components/shared/profile-photo";

interface RequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    onReject: () => void;
}

export function RequestDetailsModal({
    isOpen,
    onClose,
    onAccept,
    onReject,
}: RequestDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="
          w-full max-w-[360px] 
          max-h-[85vh] overflow-y-auto 
          bg-white rounded-2xl shadow-2xl 
          relative
        "
            >
                <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900">Request Details</h2>
                            <p className="text-[14px] text-gray-500 mt-0.5">#REQ-1233456</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Green earnings section (now starts right after white header) */}
                <div className="bg-[#2F6B4F] text-white px-5 py-5">
                    <div className="bg-[#1E4A38] rounded-lg px-4 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">POTENTIAL EARNINGS</span>
                            <span className="bg-green-500/20 text-green-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                100% MATCH
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-4">$142.50</div>

                        {/* Pickup window and total units inside green block */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-700/30 rounded-lg p-3.5">
                                <div className="text-xs text-gray-300 font-medium mb-1">PICKUP WINDOW</div>
                                <div className="text-sm font-semibold text-white leading-tight">
                                    OCT 12 • 10:00 AM – 12:00 PM
                                </div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3.5">
                                <div className="text-xs text-gray-300 font-medium mb-1">TOTAL ESTIMATED UNITS</div>
                                <div className="text-sm font-semibold text-white">70 units</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="p-5 space-y-6">
                    {/* Order Summary */}
                    <div>
                        <h3 className="text-base font-bold mb-3 text-gray-800">ORDER SUMMARY</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden text-sm">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-2.5 font-medium">Material</th>
                                        <th className="text-center px-3 py-2.5 font-medium">Units</th>
                                        <th className="text-right px-4 py-2.5 font-medium">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-2.5">Glass bottles</td>
                                        <td className="text-center py-2.5">44</td>
                                        <td className="text-right px-4 py-2.5 font-medium">$100.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5">Tins/Cans</td>
                                        <td className="text-center py-2.5">24</td>
                                        <td className="text-right px-4 py-2.5 font-medium">$10.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5">Drink boxes</td>
                                        <td className="text-center py-2.5">16</td>
                                        <td className="text-right px-4 py-2.5 font-medium">$12.50</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* User & Location */}
                    <div>
                        <h3 className="text-base font-bold mb-3 text-gray-800">USER & LOCATION</h3>
                        <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <ProfilePhoto className="w-10 h-10 rounded-full shrink-0" name="Jane Doe" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-base">Jane Doe</span>
                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">JD</span>
                                </div>
                                <div className="text-xs text-gray-600 mt-0.5">(124 pickups)</div>
                                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-700">
                                    <MapPin size={14} className="text-gray-500 shrink-0" />
                                    <span className="truncate">123, Albert str., Regina, SK S4P 3Y2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="text-xs font-medium text-[#111827BF] mb-1.5">NOTE FROM USER</div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Please ring the back doorbell when you arrive. Bags are labeled 'Recycling' and placed near the garage door.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-5 py-4 border-t flex gap-3">
                    <button
                        onClick={onReject}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-200 text-sm"
                    >
                        <XCircle size={18} />
                        Reject
                    </button>

                    <button
                        onClick={onAccept}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#2F6B4F] text-white font-semibold rounded-xl hover:bg-[#265a42] transition-colors text-sm"
                    >
                        <Check size={18} />
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}