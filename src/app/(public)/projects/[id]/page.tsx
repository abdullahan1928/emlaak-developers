"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { LocationOn, Category, ArticleOutlined, AccountBalanceOutlined, FolderOutlined } from "@mui/icons-material";
import { Typography, CircularProgress, Tabs, Tab, Box } from "@mui/material";
import axios from "axios";
import { IProject } from "@/interfaces/project";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const swiperStyles = `
.swiper-button-next,
.swiper-button-prev {
    // background-color: white;
    padding: 24px;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    color: white !important;
}

.swiper-button-next:after,
.swiper-button-prev:after {
    font-size: 24px !important;
    font-weight: bold;
}

.swiper-button-disabled {
    opacity: 0.5 !important;
}

.image-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem;
    color: white;
    z-index: 10;
}
`;

const ProjectPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState<IProject>({
        _id: 0,
        title: "",
        price: "0",
        location: "",
        category: "",
        description: "",
        tags: [],
        pictures: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [activeImage, setActiveImage] = useState<string>('');
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/projects/${id}`);
                setProject(response.data);
                if (response.data.pictures.length > 0) {
                    setActiveImage(response.data.pictures[0]);
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch project details.");
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleThumbnailClick = (image: string, index: number) => {
        setActiveImage(image);
        if (swiperRef) {
            swiperRef.slideTo(index);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="bg-[#F6F7F9] pt-24">
            <style>{swiperStyles}</style>
            <div className="container p-4 mx-auto">
                <h1 className="text-5xl font-bold mb-12 text-left text-black">
                    {project.title}, {project.location.split(',')[0]}
                </h1>

                <div className="grid grid-cols-12 gap-8 mb-12">
                    <div className="col-span-2">
                        <div className="sticky top-24 space-y-4 pr-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {project.pictures.map((image: string, index: number) => (
                                <>
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className={`w-full h-24 object-cover rounded-lg transition-transform duration-300 ${activeImage === image ? 'border-[3px] border-secondary-300 shadow-md' : 'hover:ring-1 hover:ring-gray-300'}`}
                                        onClick={() => handleThumbnailClick(image, index)}
                                    />
                                </>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-7">
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                            <div className="absolute top-4 right-4 border border-[#FCEF35] bg-white/85 backdrop-blur-sm px-3 py-2 rounded-full z-10">
                                <p className="text-base text-gray-800 flex items-center gap-2">
                                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle id="Ellipse 2" cx="3" cy="3" r="3" fill="#FCEF35" />
                                    </svg>
                                    Price: {parseInt(project.price.replace(/,/g, '')) >= 1000000 ? `${(parseInt(project.price.replace(/,/g, '')) / 1000000).toFixed(0)} M` : project.price}
                                </p>
                            </div>
                            <Swiper
                                modules={[Navigation]}
                                navigation
                                loop={true}
                                className="h-[600px] rounded-xl"
                                onSwiper={setSwiperRef}
                                onSlideChange={(swiper) => {
                                    const realIndex = swiper.realIndex;
                                    setActiveImage(project.pictures[realIndex]);
                                }}
                            >
                                {project.pictures.map((image: string, index: number) => (
                                    <SwiperSlide key={index} className="relative">
                                        <Image
                                            src={image}
                                            alt={project.title}
                                            width={1000}
                                            height={1000}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="image-overlay">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-2xl font-semibold">
                                                    {project.title}
                                                    <br />
                                                    <span className="text-base">{project.category}</span>
                                                </h2>
                                                <p className="text-xl font-bold">
                                                    <span className="text-base">Price</span>
                                                    <br />
                                                    Rs. {project.price}
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    <div className="col-span-3">
                        <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6 space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Project Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <LocationOn className="text-gray-500" />
                                    <p className="text-gray-700">{project.location}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Category className="text-gray-500" />
                                    <p className="text-gray-700">{project.category}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-6">
                    <Box sx={{
                        borderBottom: 0,
                        '& .MuiTabs-root': {
                            minHeight: '60px',
                            borderRadius: '12px',
                            backgroundColor: '#F3F1F1',
                            padding: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            width: 'fit-content',
                        },
                        '& .MuiTabs-indicator': {
                            height: '100%',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            zIndex: 1,
                        },
                    }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    color: '#64748b',
                                    fontWeight: 500,
                                    zIndex: 2,
                                    minHeight: '44px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    padding: '12px 40px',
                                    '&.Mui-selected': {
                                        color: '#1e293b',
                                        fontWeight: 600,
                                    },
                                    '&:hover': {
                                        fontWeight: 500,
                                        color: '#1e293b',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        marginRight: '8px',
                                        fontSize: '20px',
                                    },
                                    transition: 'all 0.2s ease',
                                },
                                '& .MuiTabs-flexContainer': {
                                    gap: '16px',
                                },
                            }}
                        >
                            <Tab label="Details" icon={<ArticleOutlined />} iconPosition="start" />
                            <Tab label="Financials" icon={<AccountBalanceOutlined />} iconPosition="start" />
                            <Tab label="Documents" icon={<FolderOutlined />} iconPosition="start" />
                        </Tabs>
                    </Box>
                    <div className="py-8">
                        {activeTab === 0 && (
                            <div className="relative bg-[#f0f4ff] py-5">
                                <div
                                    className={`prose max-w-none animate-fadeIn rounded-2xl px-10 mt-6 text-sm
                                    ${!isExpanded ? 'max-h-[200px] overflow-hidden' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: project.description }}
                                />
                                {!isExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0f4ff] to-transparent pointer-events-none" />
                                )}
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-4 flex items-center gap-2 mx-auto px-6 py-2 text-black transition-colors relative z-10 font-bold"
                                >
                                    {isExpanded ? 'Show Less' : 'Read More'}
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {activeTab === 1 && (
                            <div className="text-center py-12 text-gray-500 animate-fadeIn">
                                <p className="text-lg">Financial information is not available for this project.</p>
                            </div>
                        )}
                        {activeTab === 2 && (
                            <div className="text-center py-12 text-gray-500 animate-fadeIn">
                                <p className="text-lg">No documents are currently available for this project.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
