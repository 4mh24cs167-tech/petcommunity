import Link from 'next/link';
import { Dog } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Dog className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Pet<span className="text-blue-600">Community</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
              Connecting pet owners worldwide to foster healthier, happier lives for our beloved animal companions through community and expert care.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/breeds" className="hover:text-blue-600 transition">Breed Directory</Link></li>
              <li><Link href="/hospitals" className="hover:text-blue-600 transition">Find Vets</Link></li>
              <li><Link href="/matches" className="hover:text-blue-600 transition">Match Pets</Link></li>
              <li><Link href="/community" className="hover:text-blue-600 transition">Community Feed</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/qa" className="hover:text-blue-600 transition">Vet Q&A</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} PetCommunity. Built with ❤️ for pets everywhere.
        </div>
      </div>
    </footer>
  );
}
