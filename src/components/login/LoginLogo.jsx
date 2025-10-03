import logo from "/src/assets/logos/logo3.png";

const AnimatedLogo = ({ className }) => (
    <div className="w-full max-w-[700px] lg:mx-36 mx-auto aspect-square relative group cursor-pointer">
      <img
        src={logo}
        alt="Lingo Academy Logo"
        className="w-full h-full object-contain transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:drop-shadow-[0_10px_10px_rgba(165,103,194,0.25)]"
      />
    </div>
  );
  
  export default AnimatedLogo;