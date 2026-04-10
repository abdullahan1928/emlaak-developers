"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { heroItems } from "@/data/hero.data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxGroup,
    ComboboxSeparator,
    ComboboxLabel,
    CustomComboboxInput,
} from "@/components/ui/combobox"
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";

const SLIDE_DURATION = 9000;

interface HeroSearchContent {
    id: string
    title: string
    slug: string
    location: string
    image: string
    type: string
    price: number
}

const Hero = () => {
    const parallaxRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [progressKey, setProgressKey] = useState(0);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // AOS init
    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
        });
    }, []);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setPrevIndex(activeIndex);
            setActiveIndex((prev) =>
                prev === heroItems.length - 1 ? 0 : prev + 1
            );
            setProgressKey((prev) => prev + 1);
        }, SLIDE_DURATION);

        return () => clearInterval(interval);
    }, [activeIndex]);

    // Parallax
    useEffect(() => {
        const handleScroll = () => {
            if (parallaxRef.current) {
                const scrollY = window.scrollY;
                parallaxRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/search?q=${query}`);
                const data = await res.json();
                console.log(data.results)
                setResults(data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [query]);

    const activeItem = heroItems[activeIndex];

    const projects: HeroSearchContent[] = results.filter(r => r.type === "project");
    const properties: HeroSearchContent[] = results.filter(r => r.type === "property");

    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Images */}
            <div
                ref={parallaxRef}
                className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
            >
                {heroItems.map((item, index) => (
                    <Image
                        key={index}
                        src={`/images/home/${item.image}`}
                        alt={item.name}
                        fill
                        sizes="100vw"
                        priority={index === 0}
                        className={cn(
                            "object-cover transition-all duration-1600 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            index === activeIndex && "opacity-100 scale-100 z-20",
                            index === prevIndex && "opacity-0 scale-110 z-10"
                        )}
                    />
                ))}
            </div>

            {/* Overlay Layers */}
            <div className="absolute inset-0 z-10">
                <div className="absolute inset-0 bg-secondary/60" />
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0" />
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] bg-[url('/noise.png')]" />

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10 z-30">
                <div
                    key={progressKey}
                    className="h-full bg-primary"
                    style={{
                        animation: `progress ${SLIDE_DURATION}ms linear forwards`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-40 h-full flex items-center px-6 md:px-16">
                <div className="max-w-2xl text-white space-y-16">
                    {/* Title */}
                    <h1
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className="text-4xl font-medium tracking-tight leading-[1.1] font-futura uppercase text-primary"
                    >
                        {activeItem.name} {" "}
                        <span
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-lg"
                        >
                            {activeItem.desc1}
                        </span>
                    </h1>

                    {/* Description */}
                    <p
                        data-aos="fade-up"
                        data-aos-delay="300"
                        className="text-white/50 text-sm md:text-base max-w-2xl"
                    >
                        {activeItem.desc2}
                    </p>

                    {/* Buttons */}
                    {/* <div
                        data-aos="fade-up"
                        data-aos-delay="400"
                        className="flex gap-4 pt-4"
                    >
                        <Button className="bg-primary text-black px-8 py-5 rounded-full text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            {activeItem.buttonText}
                        </Button>

                        <Button
                            variant="outline"
                            className="border-white/40 text-black px-8 py-5 rounded-full backdrop-blur-md hover:bg-white hover:text-black transition"
                        >
                            Contact Us
                        </Button>
                    </div> */}

                    {/* Search */}
                    {/* <div
                        data-aos="fade-up"
                        data-aos-delay="500"
                        className="mt-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full px-4 py-2 flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)] max-w-xl relative"
                    >
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search city, location, or property..."
                            className="bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0"
                        />

                        <Button className="bg-primary text-black px-5 h-10 rounded-full shrink-0">
                            <Search size={18} />
                        </Button>

                        {(projects.length > 0 || properties.length > 0) && (
                            <Card className="absolute -top-full mt-2 left-0 right-0 z-[999] border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden p-0!">

                                <ScrollArea className="max-h-[320px]">

                                    {projects.length > 0 && (
                                        <div className="p-3">
                                            <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase px-2 pb-2">
                                                Projects
                                            </p>

                                            <div className="space-y-1">
                                                {projects.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5 transition cursor-pointer"
                                                    >
                                                        <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {item.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {projects.length > 0 && properties.length > 0 && (
                                        <Separator />
                                    )}

                                    {properties.length > 0 && (
                                        <div className="p-3">
                                            <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase px-2 pb-2">
                                                Properties
                                            </p>

                                            <div className="space-y-1">
                                                {properties.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5 transition cursor-pointer"
                                                    >
                                                        <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {item.title}
                                                            </p>

                                                            <p className="text-xs text-gray-500 truncate">
                                                                {item.location}
                                                            </p>

                                                            {item.price && (
                                                                <p className="text-xs text-gray-700 font-medium">
                                                                    PKR {item.price.toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </ScrollArea>
                            </Card>
                        )}

                        {query && results.length === 0 && !loading && (
                            <Card className="absolute top-full mt-2 left-0 right-0 z-[999] p-4 text-sm text-gray-500 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl">
                                No results found.
                            </Card>
                        )}
                    </div> */}

                    <div className="mt-6 max-w-xl">
                        <Combobox
                            items={results}
                            itemToStringValue={(item: HeroSearchContent) => item.title}
                            onInputValueChange={setQuery}
                        >
                            <CustomComboboxInput
                                value={query}
                                onChange={setQuery}
                                placeholder="Search city, location, or property..."
                            />

                            <ComboboxContent
                                className={cn(
                                    "bg-white/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl",
                                    query === "" && "hidden"
                                )}
                                sideOffset={20}
                            >
                                {loading ? (
                                    <div className="p-4 text-center text-gray-500">Searching...</div>
                                ) : results.length === 0 ? (
                                    <ComboboxEmpty>No results found.</ComboboxEmpty>
                                ) : (
                                    <ComboboxList className="max-h-80 overflow-auto">
                                        {projects.length > 0 && (
                                            <ComboboxGroup>
                                                <ComboboxLabel>Projects</ComboboxLabel>
                                                {projects.map((project) => (
                                                    <ComboboxItem key={project.id} value={project} className="cursor-pointer hover:bg-gray-300!" onClick={() => router.push(ROUTES.PUBLIC.PROJECTS.VIEW(project.slug))}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                                                                {project.image ? (
                                                                    <Image
                                                                        src={project.image}
                                                                        alt={project.title}
                                                                        fill
                                                                        sizes="48px"
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-sm font-semibold text-gray-600">
                                                                        {project.title?.charAt(0)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{project.title}</p>
                                                                <p className="text-xs text-gray-500">{project.location}</p>
                                                            </div>
                                                        </div>
                                                    </ComboboxItem>
                                                ))}
                                            </ComboboxGroup>
                                        )}

                                        {projects.length > 0 && properties.length > 0 && <ComboboxSeparator />}

                                        {properties.length > 0 && (
                                            <ComboboxGroup>
                                                <ComboboxLabel>Properties</ComboboxLabel>
                                                {properties.map((item) => (
                                                    <ComboboxItem key={item.id} value={item} className="cursor-pointer" onClick={() => router.push(ROUTES.PUBLIC.PROPERTIES.VIEW(item.slug))}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{item.title}</p>
                                                                <p className="text-xs text-gray-500">{item.location}</p>
                                                                {item.price && <p className="text-xs font-medium">PKR {item.price.toLocaleString()}</p>}
                                                            </div>
                                                        </div>
                                                    </ComboboxItem>
                                                ))}
                                            </ComboboxGroup>
                                        )}
                                    </ComboboxList>
                                )}
                            </ComboboxContent>
                        </Combobox>
                    </div>

                </div>
            </div>


            {/* Thumbnails */}
            <div className="absolute bottom-6 right-6 flex gap-3 z-45">
                {heroItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setPrevIndex(activeIndex);
                            setActiveIndex(index);
                            setProgressKey((prev) => prev + 1);
                        }}
                        className={cn(
                            "relative w-24 h-32 rounded-xl overflow-hidden cursor-pointer transition-all duration-500",
                            index === activeIndex
                                ? "scale-110 shadow-2xl ring-2 ring-primary"
                                : "opacity-60 hover:opacity-100 hover:scale-105"
                        )}
                    >
                        <Image
                            src={`/images/home/${item.image}`}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-secondary/20 hover:bg-secondary/0 transition" />
                    </div>
                ))}
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-45">
                {heroItems.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setPrevIndex(activeIndex);
                            setActiveIndex(i);
                            setProgressKey((prev) => prev + 1);
                        }}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            i === activeIndex
                                ? "w-8 bg-primary"
                                : "w-2 bg-white/40 hover:bg-white"
                        )}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;