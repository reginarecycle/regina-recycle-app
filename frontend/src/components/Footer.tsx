import logo from "../assets/logo.svg";

import addressIcon from "../assets/icons/address.svg";
import mailIcon from "../assets/icons/mail.svg";
import phoneIcon from "../assets/icons/phone.svg";

function Footer() {
  return (
    <footer className="w-full bg-[#F9FAFB] border-t border-[#CFCFCF]">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1512px] px-6 md:px-[123px] pt-10 md:pt-[72px] pb-6 md:pb-[41px]">
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
           
            <div className="max-w-[360px]">
              <div className="flex items-center gap-2">
                <img src={logo} alt="ReginaRecycle logo" className="w-6 h-6" />
                <h2 className="text-2xl font-bold leading-8">
                  <span className="text-black">Regina</span>
                  <span className="text-[#618171]">Recycle</span>
                </h2>
              </div>

              <p className="mt-4 text-sm leading-5 text-[rgba(17,24,39,0.75)]">
                Empowering communities to reduce waste through technology and education.
              </p>
            </div>

            
            <div className="min-w-[180px]">
              <h3 className="text-lg font-black leading-7 text-black">Resources</h3>
              <ul className="mt-4 space-y-2 text-base font-medium leading-6 text-[rgba(17,24,39,0.75)]">
                <li>
                  <a href="#about" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#centers" className="hover:underline">
                    Find Local Centers
                  </a>
                </li>
                <li>
                  <a href="#learn" className="hover:underline">
                    Learn to Recycle
                  </a>
                </li>
              </ul>
            </div>

          
            <div className="min-w-[260px]">
              <h3 className="text-lg font-black leading-7 text-black">Contact</h3>

              <div className="mt-4 space-y-3 text-sm leading-5 text-[rgba(17,24,39,0.75)]">
                <div className="flex items-start gap-3">
                  <img src={addressIcon} alt="Address" className="w-4 h-4 mt-[2px]" />
                  <span>123 Green Way, Regina, SK S4P 000</span>
                </div>

                <div className="flex items-start gap-3">
                  <img src={mailIcon} alt="Email" className="w-4 h-4 mt-[2px]" />
                  <span>info.reginarecycle@gmail.com</span>
                </div>

                <div className="flex items-start gap-3">
                  <img src={phoneIcon} alt="Phone" className="w-4 h-4 mt-[2px]" />
                  <span>(306) 000-0000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-[#CFCFCF]" />

         
          <div className="pt-6">
            <p className="text-center text-sm font-medium leading-5 text-black">
              © 2026 ReginaRecycle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;