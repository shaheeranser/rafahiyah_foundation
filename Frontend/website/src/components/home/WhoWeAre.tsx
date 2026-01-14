import { Button } from "@/components/ui/button";
import img1 from "@/assets/women-learning-leading.jpg";
import img2 from "@/assets/women-supporting-each-other.jpg";
import img3 from "@/assets/success-story-woman.jpg";

const WhoWeAre = () => {
    // Generate spiral dots algorithmically
    const generateSpiral = (numArms = 3, dotsPerArm = 40) => {
        const dots = [];
        const colors = ["bg-rafahiyah-gold", "bg-rafahiyah-dark-gold", "bg-rafahiyah-deep-red"];

        for (let i = 0; i < numArms; i++) {
            const angleOffset = (2 * Math.PI / numArms) * i;
            for (let j = 0; j < dotsPerArm; j++) {
                // Archimedean spiral: r = a + b * theta
                const theta = 0.5 * j; // Spread of angle
                const radius = 2 + 1.2 * j; // Spread of radius

                // Convert polar to cartesian
                // Adding offset to center it relative to the container usually
                // but here we use % to make it responsive
                const x = radius * Math.cos(theta + angleOffset);
                const y = radius * Math.sin(theta + angleOffset);

                // Map to percentage center (50% 50% is 0,0)
                // Scaling down to fit
                const left = 50 + x * 0.8;
                const top = 50 + y * 0.8;

                // Vary size
                const sizeClass = j % 5 === 0 ? "w-4 h-4" : j % 3 === 0 ? "w-3 h-3" : "w-2 h-2";

                dots.push({
                    left: `${left}%`,
                    top: `${top}%`,
                    size: sizeClass,
                    color: colors[i % colors.length],
                    opacity: Math.max(0.2, 1 - j / dotsPerArm) // Fade out towards outside
                });
            }
        }
        return dots;
    };

    const dots = generateSpiral(5, 50); // 5 arms, 50 dots each for "multi dotted" look

    return (
        <section className="py-20 bg-white relative overflow-hidden min-h-[700px] flex items-center">
            {/* Spiral/Dot Background - Focused on the Right Side */}
            <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full pointer-events-none z-0 hidden md:block opacity-40">
                <div className="relative w-full h-full">
                    {dots.map((dot, i) => (
                        <div
                            key={i}
                            className={`absolute rounded-full ${dot.color} ${dot.size}`}
                            style={{
                                left: dot.left,
                                top: dot.top,
                                opacity: dot.opacity
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">

                {/* Left Side: Content */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <h2 className="text-5xl md:text-6xl font-odibee text-gray-800">
                        Who We Are?
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed font-sans max-w-xl text-justify">
                        We Are a Dedicated Group of Passionate Young Individuals Who Are Committed to Transformation Through Tangible Actions. Whether It's Supporting Needy Families, Educating and Inspiring Youth, or Responding to Crises, We Believe That Every Kind Act Creates a Ripple of Transformation in the Society. With Transparency and Compassion In Heart, We Work Hand in Hand With Everyone to Build a Prosperous Future Where Dignity and Opportunity are Within Reach For All.
                    </p>
                    <p>

                    </p>
                    <a href="/about">
                        <Button className="bg-rafahiyah-deep-red text-white hover:bg-[#6b2416] hover:text-white font-odibee tracking-wider rounded-full px-8 py-2 text-lg shadow-md transition-all">
                            Learn More
                        </Button>
                    </a>
                </div>

                {/* Right Side: Images */}
                <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center justify-center mt-8 lg:mt-0">
                    {/* Image 1 - Top Right - Large & Rotated */}
                    <div className="absolute top-0 right-4 md:top-10 md:right-10 w-40 h-40 md:w-64 md:h-64 bg-gray-200 rounded-[2rem] shadow-xl transform rotate-12 z-10 overflow-hidden border-4 border-white">
                        {/* Placeholder or actual image */}
                        <img src={img1} alt="Team" className="w-full h-full object-cover" />
                    </div>

                    {/* Image 2 - Main Center/Left - Large & Rotated */}
                    <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 bg-gray-300 rounded-[2rem] shadow-xl transform -rotate-6 z-20 overflow-hidden border-4 border-white">
                        <img src={img2} alt="Community" className="w-full h-full object-cover" />
                    </div>

                    {/* Image 3 - Bottom Right - Smaller & Rotated */}
                    <div className="absolute bottom-0 right-8 md:bottom-20 md:right-20 w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-[1.5rem] shadow-xl transform rotate-6 z-0 overflow-hidden border-4 border-white">
                        <img src={img3} alt="Success Story" className="w-full h-full object-cover" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhoWeAre;
