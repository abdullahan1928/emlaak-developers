"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { IProject } from '@/interfaces/project';
import { TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Pagination, SelectChangeEvent } from '@mui/material';
import { Search, LocationOn, FilterList, Sort, AttachMoney, Visibility, Category } from '@mui/icons-material';
import ProjectCard from '@/components/projects/ProjectCard';
import Image from 'next/image';

const Page: React.FC = () => {
  const [filters, setFilters] = useState({ keyword: '', location: '', choices: '', floors: '' });
  const [projects, setProjects] = useState<IProject[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [cardsToShow, setCardsToShow] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch projects.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name as string]: value }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: any) => {
    setSort(event.target.value as string);
  };

  const handleCardsToShowChange = (event: SelectChangeEvent<number>, child: ReactNode) => {
    setCardsToShow(event.target.value as number);
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
    <>
      <div className="relative mb-4 w-full h-[40vh]">
        <Image
          src="/images/project/project2.jpg"
          alt="Projects"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-5xl font-bold text-white">Emlaak Developers</h1>
          <p className="mt-2 text-lg text-white">Building Dreams, Creating Futures</p>
        </div>
      </div>
      
      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-4xl font-bold">Properties</h1>
        {/* <p className="mb-4 text-gray-700">Browse our projects. Use the filters below to refine your search.</p> */}
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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
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
          </>
        )}
      </div>
    </>
  );
};

export default Page;
