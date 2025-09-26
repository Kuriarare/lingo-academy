import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#9E2FD0] to-[#A567C2] py-4 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between space-y-2 md:space-y-0">
          {/* Compact branding */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent tracking-wide">
              Lingolandias
            </span>
          </div>
          
          {/* Social icons row */}
          <div className="flex space-x-3">
            <a 
              href="https://www.facebook.com/lingolandias" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-300 transition-colors p-1"
            >
              <FiFacebook size={18} />
            </a>
            <a 
              href="https://www.instagram.com/lingolandias" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-300 transition-colors p-1"
            >
              <FiInstagram size={18} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-300 transition-colors p-1"
            >
              <FiTwitter size={18} />
            </a>
          </div>

          {/* Inline copyright */}
          <div className="text-sm text-white/80 font-medium">
            <span className="text-emerald-200/90">© {new Date().getFullYear()}</span>
            {" "}• &quot;Share the world&apos;s soul&quot;
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-r from-[#9E2FD0] to-[#A567C2] py-4">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col items-center gap-y-3 sm:flex-row sm:justify-between">
//           {/* Enhanced brand title */}
//           <span className="text-xl font-black bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent tracking-tight">
//             Lingolandias
//           </span>

//           {/* Social icons */}
//           <div className="flex space-x-3">
//             <a 
//               href="https://facebook.com" 
//               className="text-white/90 hover:text-emerald-300 transition-colors"
//             >
//               <FiFacebook size={18} />
//             </a>
//             <a 
//               href="https://instagram.com" 
//               className="text-white/90 hover:text-emerald-300 transition-colors"
//             >
//               <FiInstagram size={18} />
//             </a>
//             <a 
//               href="https://twitter.com" 
//               className="text-white/90 hover:text-emerald-300 transition-colors"
//             >
//               <FiTwitter size={18} />
//             </a>
//           </div>

//           {/* Copyright */}
//           <span className="text-sm text-white/80">
//             ©{new Date().getFullYear()}
//           </span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;