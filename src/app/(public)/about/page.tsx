import { about, INDEX_TO_HIGHLIGHT, stats } from "@/data/about.data";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/data/social.data";

export const metadata = {
    metadataBase: new URL(SITE_URL),

    title: "About",
    description:
        "Learn about Emlaak Developers – a trusted real estate company delivering premium property investment, marketing, and consultancy services across Pakistan.",

    keywords: [
        "about Emlaak Developers",
        "real estate company Pakistan",
        "property investment experts",
        "real estate consultancy",
        "Emlaak team",
    ],

    twitter: {
        card: "summary_large_image",
        title: "About Emlaak Developers",
        description:
            "Meet the team and vision behind one of Pakistan’s emerging real estate companies.",
        images: ["/images/about/about.jpg"],
    },
};

const Page = () => {
    const ceo = about[INDEX_TO_HIGHLIGHT];
    const rest = about.filter((_, i) => i !== INDEX_TO_HIGHLIGHT);

    return (
        <div className="bg-white">

            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Redefining Real Estate Excellence
                </h1>
                <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Emlaak Developers is a forward-thinking real estate company focused on
                    delivering premium investment opportunities, innovative marketing strategies,
                    and high-value developments across Pakistan. With decades of experience,
                    we combine trust, technology, and vision to shape the future of real estate.
                </p>
            </section>

            <section className="bg-secondary text-white py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                            <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    <div className="relative w-full h-150 rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src={`/images/about/${ceo.image}`}
                            alt={ceo.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <p className="text-primary font-semibold uppercase text-sm mb-2">
                            Leadership
                        </p>

                        <h2 className="text-3xl font-bold mb-2">
                            {ceo.name}
                        </h2>

                        <p className="text-gray-500 uppercase text-sm mb-4">
                            {ceo.designation}
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            {ceo.description}
                        </p>
                    </div>

                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="bg-secondary py-20">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold text-white">
                            Meet Our Leadership
                        </h2>
                        <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                            A team of visionaries driving innovation and excellence in real estate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {rest.map((member, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10",
                                    "hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl"
                                )}
                            >
                                <div className="relative h-100 w-full overflow-hidden">
                                    <Image
                                        src={`/images/about/${member.image}`}
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-secondary via-secondary/30 to-transparent" />
                                </div>

                                <div className="py-6 px-3 text-center">
                                    <h3 className="text-xl font-semibold text-white">
                                        {member.name}
                                    </h3>

                                    <p className="text-primary text-sm uppercase tracking-wide mt-1">
                                        {member.designation}
                                    </p>

                                    <p className="text-white/70 text-sm mt-4 line-clamp-6">
                                        {member.description}
                                    </p>
                                </div>

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto text-center px-6">

                    <h2 className="text-3xl md:text-4xl font-semibold text-black">
                        Let’s Build Something Great Together
                    </h2>

                    <p className="text-gray-600 mt-4">
                        Whether you&apos;re investing, buying, or selling, we are here to guide you every step of the way.
                    </p>

                    <Button
                        className="mt-8 px-8 py-6 bg-secondary text-white rounded-lg hover:bg-primary hover:text-black transition-all duration-300 text-sm font-semibold tracking-wide shadow-lg"
                    >
                        <Link href={ROUTES.PUBLIC.ABOUT}>
                            Contact Us
                        </Link>
                    </Button>

                </div>
            </section>

        </div>
    );
};

export default Page;