import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <PageHeader 
        title="About Us" 
        subtitle="Leading the way in Africa's digital and industrial transformation."
      />
      
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-12 text-gray-300 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Vision</h2>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 py-8">
            <div className="p-6 border border-gray-800 rounded-2xl bg-gray-900/50">
              <h3 className="text-xl font-bold text-yellow-500 mb-2">Innovation</h3>
              <p className="text-sm">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.
              </p>
            </div>
            <div className="p-6 border border-gray-800 rounded-2xl bg-gray-900/50">
              <h3 className="text-xl font-bold text-yellow-500 mb-2">Integrity</h3>
              <p className="text-sm">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Story</h2>
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
