// import logo from "../assets/logo.svg";

// import addressIcon from "../assets/icons/address.svg";
// import mailIcon from "../assets/icons/mail.svg";
// import phoneIcon from "../assets/icons/phone.svg";

import { MapPin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import RRLogo from "@/assets/rrlogo.svg?react";

const resources = ["About us", "Find Local Centers", "Learn to Recycle"];

function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-10">
        <div className="flex flex-col gap-8 md:gap-14 items-end w-full">
          {/* Footer Content */}
          <motion.div
            className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Logo and Description */}
            <div className="flex flex-col gap-4 max-w-sm">
              <RRLogo className="text-primary" />
              <p className="text-sm text-foreground/75 leading-6">
                Empowering communities to reduce waste through technology and
                education.
              </p>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-black text-black">Resources</h4>
              <ul className="flex flex-col gap-4">
                {resources.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-foreground/75 cursor-pointer hover:text-primary transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-black text-black">Contact</h4>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/75 leading-5">
                    123 Green Way, Regina,
                    <br />
                    S4P 000
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground/75">
                    info.reginarecycle@gmail.com
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground/75">
                    (306) 000-0000
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="w-full border-t border-border" />

          {/* Copyright */}
          <p className="text-sm text-black text-center w-full">
            © 2026 ReginaRecycle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
