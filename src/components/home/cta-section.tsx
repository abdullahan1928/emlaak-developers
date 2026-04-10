import { ROUTES } from "@/routes"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const CTASection = () => {
  return (
    <section className="pb-24 px-4 md:px-16 bg-white">
      <div
        className="relative rounded-3xl bg-secondary text-white p-12 md:p-16 overflow-hidden"
        data-aos="fade-up"
      >

        {/* Glow */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent blur-2xl" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">

          <h3 className="text-3xl md:text-4xl font-bold">
            Let’s Build Something Valuable
          </h3>

          <p className="mt-4 text-gray-300">
            Whether you’re buying, selling, or investing, our team is ready to guide you with expertise and precision.
          </p>

          <Link href={ROUTES.PUBLIC.CONTACT}>
            <button className="mt-8 px-8 py-4 bg-primary text-black font-semibold rounded-full hover:bg-white transition flex items-center gap-2 mx-auto">
              Get in Touch <ArrowRight size={18} />
            </button>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default CTASection