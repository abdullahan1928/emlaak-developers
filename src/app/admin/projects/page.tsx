"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, TextField, MenuItem, Select, FormControl, InputLabel, TableSortLabel, TablePagination, IconButton, SelectChangeEvent } from '@mui/material';
import { Search, Category, Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { IProject } from '@/interfaces/project';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof IProject>('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                setProjects(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleCategoryChange = (e: SelectChangeEvent<string>, child: ReactNode) => {
        setCategoryFilter(e.target.value as string);
        setPage(0);
    };

    const handleRequestSort = (property: keyof IProject) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddProject = () => {
        // Handle add project logic
        router.push('/admin/projects/new');
    };

    const filterProjects = () => {
        let filtered = projects;

        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(project => project.category === categoryFilter);
        }

        return filtered.sort((a, b) => {
            // null check
            if (!a[orderBy] || !b[orderBy]) {
                return 0;
            }

            if (a[orderBy] < b[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const handleView = (id: string | undefined) => {
        router.push(`/admin/projects/view/${id}`);
    };

    const handleEdit = (id: string | undefined) => {
        // Implement the edit functionality
        router.push(`/admin/projects/edit/${id}`);
    };

    const handleDelete = async (id: string | undefined) => {
        try {
            const response = await axios.delete(`/api/projects/${id}`);
            if (response.status !== 200) {
                throw new Error('Failed to delete project');
            }
            setProjects(projects.filter(project => project._id !== id));
        } catch (err) {
            console.error('Failed to delete project:', err);
        }
    };

    const filteredProjects = filterProjects();
    const paginatedProjects = filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Projects</h1>
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <Search className="mr-2 text-gray-500" />
                            ),
                        }}
                    />
                    <FormControl variant="outlined" size="small" className="w-56">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                            label="Category"
                            startAdornment={<Category className="mr-2 text-gray-500" />}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="Commercial">Commercial</MenuItem>
                            <MenuItem value="Residential">Residential</MenuItem>
                            <MenuItem value="Industrial">Industrial</MenuItem>
                            <MenuItem value="Agricultural">Agricultural</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProject}
                    startIcon={<Add />}
                >
                    Add New Project
                </Button>
            </div>
            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead className="bg-gray-200">
                        <TableRow>
                            <TableCell className="font-bold">
                                <TableSortLabel
                                    active={orderBy === '_id'}
                                    direction={orderBy === '_id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('_id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="font-bold">
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleRequestSort('title')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="font-bold">
                                <TableSortLabel
                                    active={orderBy === 'location'}
                                    direction={orderBy === 'location' ? order : 'asc'}
                                    onClick={() => handleRequestSort('location')}
                                >
                                    Location
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="font-bold">
                                <TableSortLabel
                                    active={orderBy === 'category'}
                                    direction={orderBy === 'category' ? order : 'asc'}
                                    onClick={() => handleRequestSort('category')}
                                >
                                    Category
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="font-bold">
                                <TableSortLabel
                                    active={orderBy === 'price'}
                                    direction={orderBy === 'price' ? order : 'asc'}
                                    onClick={() => handleRequestSort('price')}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="flex justify-center items-center h-32">
                                        <CircularProgress />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {error && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-red-500">Error loading projects</TableCell>
                            </TableRow>
                        )}
                        {!loading && filteredProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="flex justify-center items-center h-32 text-red-500 text-lg">
                                        No projects found
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProjects.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell>{project._id}</TableCell>
                                    <TableCell>{project.title}</TableCell>
                                    <TableCell>{project.location}</TableCell>
                                    <TableCell>{project.category}</TableCell>
                                    <TableCell>{project.price}</TableCell>
                                    <TableCell className="space-x-2">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleView(project._id?.toString())}
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleEdit(project._id?.toString())}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(project._id?.toString())}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProjects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="mt-4"
            />
        </div>
    );
};

export default Page;

