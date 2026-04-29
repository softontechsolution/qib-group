import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with us for partnerships, inquiries, or support."
      />
      
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Let&apos;s build the future together</h2>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Whether you have a question about our services, or want to discuss a potential project, our team is ready to help.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#0096c7]/20">
                  <span className="text-[#0096c7]">📍</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Our Office</h3>
                  <p className="text-gray-400 text-sm">123 Innovation Drive, Tech City, Africa</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#0096c7]/20">
                  <span className="text-[#0096c7]">📧</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email Us</h3>
                  <p className="text-gray-400 text-sm">contact@qibgroup.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#0096c7]/20">
                  <span className="text-[#0096c7]">📞</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Call Us</h3>
                  <p className="text-gray-400 text-sm">+234 800 000 0000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900/50 border border-gray-800 p-8 md:p-10 rounded-3xl backdrop-blur-sm">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0096c7] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0096c7] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0096c7] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Your message..."
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0096c7] focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-[#0096c7] text-white font-bold rounded-xl hover:bg-white hover:text-black transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
