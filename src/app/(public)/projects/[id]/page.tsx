"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { LocationOn, Category } from "@mui/icons-material";
import { Typography, CircularProgress, Modal, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { IProject } from "@/interfaces/project";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/projects/${id}`);
                setProject(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch project details.");
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const openModal = (image: string) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
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
        <div className="container p-4 mx-auto mt-24">
            <Swiper
                modules={[Navigation]}
                navigation
                className="mb-8"
            >
                {project.pictures.map((image: string, index: number) => (
                    <SwiperSlide key={index}>
                        <Image
                            src={image}
                            alt={project.title}
                            width={10000}
                            height={10000}
                            className="w-full h-96 cursor-pointer"
                            onClick={() => openModal(image)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <h2 className="mb-8 text-4xl font-bold font-gilroy text-gray-800">
                {project.title}
            </h2>
            <table className="mb-8 w-full">
                <tr>
                    <td className="font-bold">Price</td>
                    <td>Rs. {project.price}</td>
                </tr>
                <tr>
                    <td className="font-bold">Location</td>
                    <td>{project.location}</td>
                </tr>
                <tr>
                    <td className="font-bold">Category</td>
                    <td>{project.category}</td>
                </tr>
            </table>
                {/* <div className="flex items-center justify-center">
                    <LocationOn className="mr-2" />
                    <p>{project.location}</p>
                </div>
                <div className="flex items-center justify-center">
                    <Category className="mr-2" />
                    <p>{project.category}</p>
                </div>
            </table> */}
            <h5 className="mb-4 text-2xl font-bold text-gray-800">
                Description
            </h5>
            <p className="leading-relaxed mb-24" dangerouslySetInnerHTML={{ __html: project.description }} />

            <Modal
                open={modalOpen}
                onClose={closeModal}
                className="flex items-center justify-center"
            >
                <div className="bg-white rounded-md shadow-lg relative">
                    <IconButton
                        onClick={closeModal}
                        className="absolute top-2 -right-2"
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <Image
                            src={selectedImage}
                            alt="Selected"
                            width={10000}
                            height={10000}
                            className="object-contain w-full h-full max-h-[90vh]"
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ProjectPage;
