import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import placeholderImg from "@/assets/women-supporting-each-other.jpg";

interface StandardPopupProps {
    isOpen: boolean;
    onClose: () => void;
    image: string;
    title: string;
    description: string;
    statsSlot?: React.ReactNode; // For Time, Date, CaseNo, etc.
    raised?: number;
    goal?: number;
    secondaryActionLabel?: string; // "Donate Now" or "Join as Volunteer"
    secondaryAction?: () => void; // Donate or Join action
    primaryActionLabel?: string; // Likely same as secondary or "Read More" isn't needed here, usually "Donate" or "Join"
    // Actually, usually we have one main action in modal: Donate or Join.
    // Sometimes two? In Initiatives: "Join as Volunteer" AND "Donate Now".
    // In CriticalCases: "Donate Now" only.
    // In Cases: "Donate Now" or "Join Us" (single).
    // Let's accept an actions slot or a list of actions.
    actionsSlot?: React.ReactNode;
}

const StandardPopup = ({
    isOpen,
    onClose,
    image,
    title,
    description,
    statsSlot,
    raised = 0,
    goal = 0,
    actionsSlot
}: StandardPopupProps) => {

    const showProgress = goal > 0;
    const progressPercentage = showProgress ? Math.min((raised / goal) * 100, 100) : 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl bg-white rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto overflow-y-auto md:overflow-visible">
                    {/* Left Side: Image */}
                    <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-100 relative">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = placeholderImg;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                        <h3 className="absolute bottom-4 left-4 text-3xl font-odibee text-white md:hidden drop-shadow-md z-10">
                            {title}
                        </h3>
                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col gap-6">
                        <h3 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue hidden md:block leading-none">
                            {title}
                        </h3>

                        {/* Stats Slot */}
                        {statsSlot && (
                            <div className="grid grid-cols-2 gap-4">
                                {statsSlot}
                            </div>
                        )}

                        {/* Funding Progress (Conditional) */}
                        {showProgress && (
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                                <div className="flex justify-between items-end mb-1">
                                    <div className="flex items-center gap-2 text-rafahiyah-dark-blue font-bold">
                                        <Target className="w-5 h-5" />
                                        <span>Fundraising Progress</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {Math.round(progressPercentage)}% Funded
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-rafahiyah-deep-red h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm font-medium pt-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 uppercase">Raised</span>
                                        <span className="text-rafahiyah-deep-red font-bold text-lg">${raised.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500 uppercase">Goal</span>
                                        <span className="text-gray-900 font-bold text-lg">${goal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {/* "Short content par scroll bar nahi aani chahiye" - handled by max-h and overflow-y-auto only when needed */}
                        <div className="text-gray-600 font-sans leading-relaxed text-base max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                            {description}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-auto pt-4 md:pt-0">
                            {actionsSlot}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StandardPopup;
