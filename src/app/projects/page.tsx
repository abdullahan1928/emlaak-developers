"use client";
import React, { useState } from 'react';
import { TextField, MenuItem, Pagination, Select, FormControl, InputLabel } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, LocationOn, FilterList, Sort, AttachMoney, Visibility, Category } from '@mui/icons-material';

interface Project {
    id: number;
    picture: string;
    title: string;
    location: string;
    price: string;
    category: string;
    views: number;
}

const singleProject: Project = {
    id: 1,
    picture: '/images/home/form-bg.jpg',
    title: 'Project',
    location: 'Islamabad',
    price: '$1000',
    category: 'Category 1',
    views: 100,
};

const projects: Project[] = Array(200).fill(null).map((_, index) => ({
    ...singleProject,
    id: index + 1,
    title: `${singleProject.title} ${index + 1}`,
    views: Math.floor(Math.random() * 1000),
    // price: `$${Math.floor(Math.random() * 1000)}`,
}));

const ProjectPage: React.FC = () => {
    const router = useRouter();
    const [filters, setFilters] = useState({ keyword: '', location: '', choices: '', floors: '' });
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('');
    const [cardsToShow, setCardsToShow] = useState(15);

    const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name as string]: value }));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSort(event.target.value as string);
    };

    const handleCardsToShowChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCardsToShow(event.target.value as number);
    };

    const handleCardClick = (id: number) => {
        router.push(`/projects/${id}`);
    };

    const filteredProjects = projects
        .filter((project) =>
            project.title.toLowerCase().includes(filters.keyword.toLowerCase())
            && project.location.toLowerCase().includes(filters.location.toLowerCase())
            && (filters.choices === '' || project.category === filters.choices)
            && (filters.floors === '' || project.title.includes(filters.floors))
        )
        .sort((a, b) => {
            if (sort === 'price') {
                return parseInt(a.price.substring(1)) - parseInt(b.price.substring(1));
            }
            if (sort === 'views') {
                return b.views - a.views;
            }
            return 0;
        });

    const paginatedProjects = filteredProjects.slice((page - 1) * cardsToShow, page * cardsToShow);

    return (
        <div className="container p-4 mx-auto">
            <h1 className="mb-4 text-4xl font-bold">Projects</h1>
            <p className="mb-4">Browse our projects. Use the filters below to refine your search.</p>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
                <TextField
                    label="Keyword"
                    variant="outlined"
                    size="small"
                    name="keyword"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                    className="w-full"
                    InputProps={{
                        startAdornment: <Search />,
                    }}
                />
                <TextField
                    label="Location"
                    variant="outlined"
                    size="small"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full"
                    InputProps={{
                        startAdornment: <LocationOn />,
                    }}
                />
                <FormControl variant="outlined" size="small" className="w-full">
                    <InputLabel>Choices</InputLabel>
                    <Select
                        label="Choices"
                        name="choices"
                        value={filters.choices}
                        onChange={handleFilterChange}
                        startAdornment={<FilterList />}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Category 1">Category 1</MenuItem>
                        <MenuItem value="Category 2">Category 2</MenuItem>
                        <MenuItem value="Category 3">Category 3</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" className="w-full">
                    <InputLabel>Floors</InputLabel>
                    <Select
                        label="Floors"
                        name="floors"
                        value={filters.floors}
                        onChange={handleFilterChange}
                        startAdornment={<FilterList />}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="flex items-center justify-between mb-4">
                <FormControl variant="outlined" size="small">
                    <InputLabel>Sort</InputLabel>
                    <Select
                        label="Sort"
                        value={sort}
                        onChange={handleSortChange}
                        startAdornment={<Sort />}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="views">Views</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small">
                    <InputLabel>Show</InputLabel>
                    <Select
                        label="Show"
                        value={cardsToShow}
                        onChange={handleCardsToShowChange}
                        startAdornment={<FilterList />}
                    >
                        <MenuItem value={10}>15</MenuItem>
                        <MenuItem value={20}>30</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3 lg:grid-cols-4">
                {paginatedProjects.map(project => (
                    <div key={project.id} className="overflow-hidden bg-white rounded-lg shadow-lg cursor-pointer" onClick={() => handleCardClick(project.id)}>
                        <Image
                            src={project.picture}
                            alt={project.title}
                            width={400}
                            height={200}
                            className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                            <h2 className="mb-2 text-xl font-bold">{project.title}</h2>
                            <div className="flex items-center mb-1 text-gray-700">
                                <LocationOn className="mr-1" /> {project.location}
                            </div>
                            <div className="flex items-center mb-1 text-gray-700">
                                <AttachMoney className="mr-1" /> {project.price}
                            </div>
                            <div className="flex items-center mb-1 text-gray-700">
                                <Category className="mr-1" /> {project.category}
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Visibility className="mr-1" /> {project.views}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                count={Math.ceil(filteredProjects.length / cardsToShow)}
                page={page}
                showFirstButton
                showLastButton
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};

export default ProjectPage;
