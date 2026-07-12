import Image from "next/image";
import { Heart, Users, Clock, Award } from "lucide-react";

export const metadata = {
  title: "About Us | Ananya General Store",
  description: "Learn about Ananya General Store's mission to deliver groceries in 30-45 minutes.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-saffron-50 to-leaf-50 py-14">
        <div className="container-x text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            About Ananya General Store
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            We're on a mission to bring the warmth and reliability of your
            neighbourhood kirana store to your fingertips — with the speed
            of modern technology.
          </p>
        </div>
      </section>

      <section className="container-x py-14 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900"
            alt="Our store"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ananya General Store started as a small family-run kirana shop in
            the heart of the city. Over the years, thousands of families
            trusted us for their daily grocery needs. Today, we've brought
            that same trust online — combining local expertise with
            technology to deliver fresh groceries in just 30-45 minutes.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From fresh vegetables to household essentials, we hand-pick every
            product to ensure quality that matches what you'd choose
            yourself at the local market.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 border-y border-orange-100">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Clock, title: "30-45 Min Delivery", desc: "Fast doorstep delivery, every time" },
            { icon: Heart, title: "Quality First", desc: "Hand-picked, fresh products" },
            { icon: Users, title: "10,000+ Families", desc: "Trust us for daily needs" },
            { icon: Award, title: "5+ Years", desc: "Serving our community" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-3">
                <item.icon size={24} className="text-saffron-600" />
              </div>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
