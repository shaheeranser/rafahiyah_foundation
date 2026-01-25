import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import placeholderImg from "@/assets/women-supporting-each-other.jpg";

interface StandardCardProps {
    image: string;
    title: string;
    description: string;
    raised?: number;
    goal?: number;
    category?: string; // For "Current Cases" tag or similar
    onReadMore: () => void;
    readMoreLabel?: string;
    onAction: () => void;
    actionLabel: string; // "Join Us" or "Donate Now"
    className?: string; // For any extra overrides (e.g. margin)
    showProgress?: boolean;
}

const StandardCard = ({
    image,
    title,
    description,
    raised = 0,
    goal = 1,
    category,
    onReadMore,
    onAction,
    actionLabel,
    readMoreLabel = "Read More",
    className,
    showProgress = false
}: StandardCardProps) => {

    const progressPercentage = Math.min((raised / (goal || 1)) * 100, 100);

    return (
        <div className={cn(
            "bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-start h-full hover:shadow-xl transition-shadow duration-300",
            className
        )}>
            {/* Image Container */}
            <div
                className="w-full h-56 rounded-2xl mb-6 overflow-hidden relative cursor-pointer"
                onClick={onReadMore}
            >
                {category && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rafahiyah-deep-red uppercase tracking-wider z-10 shadow-sm">
                        {category}
                    </div>
                )}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = placeholderImg; }}
                />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide capitalize text-left w-full">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed font-sans text-lg line-clamp-3 text-left w-full">
                {description}
            </p>

            {/* Progress Bar (Conditional) */}
            {showProgress && goal > 0 && (
                <div className="w-full mb-6 text-left">
                    <div className="flex justify-between items-center mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest font-sans">
                        <span className="text-rafahiyah-deep-red">Raised: ${raised.toLocaleString()}</span>
                        <span>Goal: ${goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-[#8B2D1B] h-full transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 w-full mt-auto">
                <button
                    className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#FDB931] transition-colors uppercase tracking-wider"
                    onClick={onReadMore}
                >
                    {readMoreLabel}
                </button>
                <button
                    className="flex-1 bg-rafahiyah-deep-red text-white py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#6b2416] transition-colors uppercase tracking-wider"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
};

export default StandardCard;
