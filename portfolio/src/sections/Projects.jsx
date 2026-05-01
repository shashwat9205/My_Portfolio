import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect , useState } from 'react';
import Lenis from 'lenis';

// --- Assets ---
import tyre1 from "../assets/tyre1.png";
import tyre2 from "../assets/tyre2.png"; 
import social1 from "../assets/img2.JPG"; 
import social2 from "../assets/img3.JPG";
import admin1 from "../assets/w1.PNG";
import admin2 from "../assets/w2.PNG";
import ParticlesBackground from '../components/ParticlesBackground';

const projects = [
  { title: "Tyre Marketplace", image1: tyre1, image2: tyre2, link: "#", category: "E-Commerce Platform" },
  { title: "Social Impact Hub", image1: social1, image2: social2, link: "#", category: "Non-Profit Initiative" },
  { title: "Vendor Admin Panel", image1: admin1, image2: admin2, link: "#", category: "Management System" },
];

const ProjectCard = ({ project, index, scrollYProgress }) => {
  // Start logic: P1 at 0.2, P2 at 0.45, P3 at 0.7
  const start = 0.2 + (index * 0.25);
  const end = start + 0.22;

  // 1. HARD DISPLAY TOGGLE: The ultimate fix for refresh glitches
  const display = useTransform(scrollYProgress, (pos) => 
    (pos >= start && pos <= end ? "flex" : "none")
  );
  
  const opacity = useTransform(scrollYProgress, [start, start + 0.02, end - 0.02, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.95, 1.05]);

  // 2. IMAGE TIMING (Strictly sequential)
  const img1Start = start + 0.02;
  const img1End = start + 0.11;
  const img1Z = useTransform(scrollYProgress, [start, img1Start, img1End], [-1200, -1200, 1000]);
  const img1Opacity = useTransform(scrollYProgress, [start, img1Start, img1Start + 0.01, img1End - 0.01, img1End], [0, 0, 0.7, 0.7, 0]);

  const img2Start = start + 0.11;
  const img2End = start + 0.20;
  const img2Z = useTransform(scrollYProgress, [start, img2Start, img2End], [-1200, -1200, 1000]);
  const img2Opacity = useTransform(scrollYProgress, [start, img2Start, img2Start + 0.01, img2End - 0.01, img2End], [0, 0, 0.7, 0.7, 0]);

  return (
    <motion.div 
      initial={false} // Prevents "initial" flash
      style={{ 
        opacity, 
        display,
        perspective: "1500px",
        zIndex: useTransform(scrollYProgress, [start, end], [1, 50])
      }} 
      className="absolute inset-0 items-center justify-center pointer-events-none"
    >
      {/* Project Images */}
      <motion.div style={{ z: img1Z, opacity: img1Opacity, x: "-15%", rotateZ: 4 }} className="absolute w-[350px] md:w-[600px] aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black">
        <img src={project.image1} alt="p1" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div style={{ z: img2Z, opacity: img2Opacity, x: "15%", y: "10%", rotateZ: -4 }} className="absolute w-[350px] md:w-[600px] aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black">
        <img src={project.image2} alt="p2" className="w-full h-full object-cover" />
      </motion.div>

      {/* Hero Text */}
      <motion.div style={{ scale }} className="z-20 flex flex-col items-center text-center px-4">
        <span className="text-[10px] md:text-[11px] uppercase tracking-[1em] text-cyan-400 font-bold mb-6">{project.category}</span>
        <h3 className="text-5xl md:text-[8vw] font-black uppercase text-white tracking-tighter leading-none drop-shadow-2xl">{project.title}</h3>
        <motion.a href={project.link} className="mt-10 group relative flex items-center gap-4 pointer-events-auto" whileHover={{ gap: "20px" }}>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/60 group-hover:text-cyan-400">Explore Projects</span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-400 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white group-hover:text-cyan-400"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default function Projects() {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // New safety state
  
  useEffect(() => {
    // 1. Kill browser scroll memory immediately
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({ 
      duration: 1.2, 
      lerp: 0.1, 
      smoothWheel: true 
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. The "Nuclear" Delay
    // We wait 500ms before showing ANY projects
    const timer = setTimeout(() => {
      setIsReady(true);
      lenis.resize();
      window.scrollTo(0, 0);
    }, 500);

    return () => {
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Make the Intro vanish MUCH faster (within the first 5% of the total scroll)
const introOpacity = useTransform(scrollYProgress, [0, 0.03, 0.08, 0.1], [0, 1, 1, 0]);

// 2. Make the Outro appear ONLY at the very end (last 2% of the total scroll)
const outroOpacity = useTransform(scrollYProgress, [0.96, 0.99], [0, 1]);

  return (
    <section 
      ref={containerRef} 
      className={`relative h-[1500vh] bg-black z-50 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
    >

    
      {/* 3. Only render internals once the page is stable */}
      {isReady && (
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <ParticlesBackground/>
          {/* Glow Effects */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[30vw] h-[30vw] bg-cyan-500/10 blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-900/10 blur-[150px]" />
          </div>

          {/* Intro Screen */}
          <motion.div style={{ opacity: introOpacity }} className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">
              Selected <span className="italic text-cyan-400">Works</span>
            </h2>
            <p className="mt-6 text-gray-500 uppercase tracking-[0.6em] text-xs font-bold animate-bounce">Scroll to Explore</p>
          </motion.div>

          {/* Project Rendering */}
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} scrollYProgress={scrollYProgress} />
          ))}

          {/* Outro Screen */}
          <motion.div style={{ opacity: outroOpacity }} className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
              More projects <span className="text-gray-600 italic">Incoming.</span>
            </h2>
          </motion.div>
        </div>
      )}
    </section>
  );
}