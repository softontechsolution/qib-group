import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";

export default function ICTPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <PageHeader 
        title="ICT Division" 
        subtitle="Empowering businesses through cutting-edge technology and digital innovation."
      />
      
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-12 text-gray-300 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Technology Stack</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="p-6 border border-gray-800 rounded-2xl bg-gray-900/50 text-center">
              <div className="w-12 h-12 bg-[#0096c7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0096c7] font-bold">01</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cloud Solutions</h3>
              <p className="text-xs text-gray-400">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
              </p>
            </div>
            <div className="p-6 border border-gray-800 rounded-2xl bg-gray-900/50 text-center">
              <div className="w-12 h-12 bg-[#0096c7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0096c7] font-bold">02</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cybersecurity</h3>
              <p className="text-xs text-gray-400">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa.
              </p>
            </div>
            <div className="p-6 border border-gray-800 rounded-2xl bg-gray-900/50 text-center">
              <div className="w-12 h-12 bg-[#0096c7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0096c7] font-bold">03</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI & Data</h3>
              <p className="text-xs text-gray-400">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Digital Transformation</h2>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          <div className="bg-[#0096c7]/5 border border-[#0096c7]/20 p-8 rounded-3xl mt-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Why Choose QIB ICT?</h2>
            <ul className="space-y-3 list-disc list-inside text-gray-400">
              <li>Scalable infrastructure for growing enterprises</li>
              <li>24/7 technical support and maintenance</li>
              <li>Industry-standard security protocols</li>
              <li>Innovative approach to complex problem solving</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
