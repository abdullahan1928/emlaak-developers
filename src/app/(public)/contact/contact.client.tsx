"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SOCIAL_LINKS, contact, MAP_LINK, CONTACT_PHONE } from "@/data/social.data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { getMapSrc } from "@/lib/map";

const schema = z.object({
    name: z.string().min(1, "Required"),
    phone: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    subject: z.string().min(1, "Required"),
    message: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof schema>;

const ContactPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    const handleClick = () => {
        window.open(`https://wa.me/${CONTACT_PHONE}`, "_blank");
    };

    return (
        <div className="relative bg-white min-h-screen overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-br from-primary/20 via-transparent to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

            <section className="relative text-center py-28 px-6 max-w-4xl mx-auto z-10">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                    Let’s Build Your Next <span className="text-primary">Investment</span>
                </h1>

                <p className="mt-6 text-gray-600 text-lg">
                    Premium real estate guidance, tailored opportunities, and trusted expertise.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-10">

                    <a href={`tel:${CONTACT_PHONE}`}>
                        <Button className="bg-secondary text-white hover:bg-primary hover:text-black flex gap-2 px-6 py-5 text-base shadow-lg">
                            <Phone size={18} /> Call Now
                        </Button>
                    </a>

                    <Button
                        variant="outline"
                        className="flex gap-2 px-6 py-5 text-base border-black hover:bg-green-500 hover:border-transparent hover:text-white"
                        onClick={handleClick}
                    >
                        <MessageCircle size={18} /> WhatsApp
                    </Button>

                    <a href={MAP_LINK} target="_blank">
                        <Button className="flex gap-2 px-6 py-5 text-base hover:bg-primary/80">
                            <MapPin size={18} /> Directions
                        </Button>
                    </a>

                </div>
            </section>

            <section className="relative max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-16 z-10">

                <div className="space-y-6">

                    {contact.map((item, index) => (
                        <Card
                            key={index}
                            className="border border-black/5 shadow-xl bg-white/70 backdrop-blur-xl hover:shadow-2xl transition"
                        >
                            <CardContent className="p-6 space-y-4">

                                <h3 className="text-lg font-semibold tracking-wide">
                                    {item.name}
                                </h3>

                                <div
                                    onClick={() => window.open(MAP_LINK, "_blank")}
                                    className="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-black transition"
                                >
                                    <MapPin size={18} className="text-primary" />
                                    <span>{item.location}</span>
                                </div>

                                <div className="space-y-2">
                                    {item.phone.map((phone, i) => (
                                        <a
                                            key={i}
                                            href={`tel:${phone}`}
                                            className="flex items-center gap-3 text-gray-600 hover:text-black transition"
                                        >
                                            <Phone size={18} className="text-primary" />
                                            {phone}
                                        </a>
                                    ))}
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                    <div className="group relative rounded-2xl overflow-hidden">
                        <iframe
                            src={getMapSrc(MAP_LINK)}
                            className="w-full h-87.5 border-0 transition duration-700"
                        />
                    </div>

                    <div className="flex gap-4 pt-6">
                        {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                className="p-3 rounded-full bg-white shadow-md hover:shadow-xl transition hover:-translate-y-1 border"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>

                </div>

                {/* ================= RIGHT (FORM) ================= */}
                <Card className="border border-black/5 shadow-2xl bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-10">

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold tracking-wide">
                                Send a Message
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Our team typically responds within 15 minutes.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Input placeholder="Full Name" {...register("name")} />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <Input placeholder="Phone Number" {...register("phone")} />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Input placeholder="Email Address" {...register("email")} />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <Input placeholder="Subject" {...register("subject")} />
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                                </div>
                            </div>

                            <div>
                                <Textarea
                                    placeholder="Tell us about your requirement..."
                                    rows={10}
                                    {...register("message")}
                                    className="min-h-50 max-h-100"
                                />
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>

                            <Button className="w-full bg-secondary text-white hover:bg-primary hover:text-black py-6 text-lg shadow-lg transition">
                                Send Message
                            </Button>

                        </form>

                    </CardContent>
                </Card>

            </section>

        </div>
    );
};

export default ContactPage;