import { Utensils, Coffee, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-[#8B4513]/90 to-[#654321]/95 text-[#FFFFF0] dark:from-[#654321]/95 dark:to-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">About Us</h3>
            <p className="text-[#FFFFF0]/90 text-center md:text-left leading-relaxed">
              Experience fine dining at home with Gourmet Haven. Premium ingredients, authentic recipes, delivered to your door.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">Contact</h3>
            <div className="space-y-4 text-[#FFFFF0]/90">
              <div 
                className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors cursor-pointer group" 
                data-testid="footer-email"
              >
                <Mail className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">hello@gourmethaven.com</span>
              </div>
              <div 
                className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors cursor-pointer group" 
                data-testid="footer-phone"
              >
                <Phone className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">(555) 123-4567</span>
              </div>
              <div 
                className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors cursor-pointer group" 
                data-testid="footer-address"
              >
                <MapPin className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">123 Culinary Lane, Food City</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">Dining Experience</h3>
            <div className="flex gap-8">
              <Utensils 
                className="w-10 h-10 text-[#D4AF37] animate-float hover:scale-125 transition-transform cursor-pointer" 
                data-testid="icon-utensils" 
              />
              <Coffee 
                className="w-10 h-10 text-[#D4AF37] animate-float animation-delay-300 hover:scale-125 transition-transform cursor-pointer" 
                data-testid="icon-coffee" 
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#D4AF37]/40 pt-8 text-center">
          <p className="text-[#FFFFF0]/80 text-sm" data-testid="footer-copyright">
            © 2025 Gourmet Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
