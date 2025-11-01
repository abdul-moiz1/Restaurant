import { Utensils, Coffee, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-amber-900/90 to-amber-950/95 text-amber-50 dark:from-amber-950/95 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">About Us</h3>
            <p className="text-amber-100/80 text-center md:text-left">
              Experience fine dining at home with Gourmet Haven. Premium ingredients, authentic recipes, delivered to your door.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">Contact</h3>
            <div className="space-y-3 text-amber-100/80">
              <div className="flex items-center gap-2" data-testid="footer-email">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>hello@gourmethaven.com</span>
              </div>
              <div className="flex items-center gap-2" data-testid="footer-phone">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2" data-testid="footer-address">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>123 Culinary Lane, Food City</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">Dining Experience</h3>
            <div className="flex gap-6">
              <Utensils className="w-8 h-8 text-amber-400 animate-float" data-testid="icon-utensils" />
              <Coffee className="w-8 h-8 text-amber-400 animate-float animation-delay-300" data-testid="icon-coffee" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-400/30 pt-6 text-center">
          <p className="text-amber-200/70" data-testid="footer-copyright">
            © 2025 Gourmet Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
