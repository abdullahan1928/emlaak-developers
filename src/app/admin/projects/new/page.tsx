"use client";
import React, { ReactNode, useState } from 'react';
import { TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, SelectChangeEvent, Autocomplete, Chip } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IProject } from '@/interfaces/project';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import DoneIcon from '@mui/icons-material/Done';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align',
    'script'
];

const Page = () => {
    const [project, setProject] = useState<IProject>({
        title: '',
        location: '',
        price: '',
        category: '',
        views: 0,
        description: '',
        tags: [],
        pictures: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown; }>) => {
        const { name, value } = e.target;
        setProject((prevProject) => ({
            ...prevProject,
            [name as string]: value,
        }));
    };

    const handleCategoryChange = (e: SelectChangeEvent<string>, child: ReactNode) => {
        setProject((prevProject) => ({
            ...prevProject,
            category: e.target.value as string,
        }));
    };

    const handleDescriptionChange = (value: string) => {
        setProject((prevProject) => ({
            ...prevProject,
            description: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setProject((prevProject) => ({
                ...prevProject,
                pictures: filesArray,
            }));
        }
    };

    const handleItemChange = (_: any, newValue: string[]) => {
        setProject((prevProject) => ({
            ...prevProject,
            tags: newValue,
        }));
    }

    const handleRenderItems = (value: string[], props: any) => {
        return value.map((option, index) => (
            <Chip key="" label={option} {...props({ index })} />
        ))
    }

    const handleRenderInput = (params: any) => {
        return (
            <TextField
                {...params}
                label="Add Tags"
            />
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert images to base64 format
            const base64Pictures = await Promise.all(
                project.pictures.map(async (file) => {
                    const response = await fetch(file);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    return new Promise<string>((resolve, reject) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                })
            );

            // Prepare data to send
            const projectData = {
                ...project,
                pictures: base64Pictures,
            };

            await axios.post('/api/projects', projectData);

            console.log('Project added successfully', projectData);
            setLoading(false);
            router.push('/admin/projects'); // Redirect to the projects page
        } catch (err: any) {
            setLoading(false);
            setError('Failed to add project. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center py-16 min-h-screen bg-gray-100">
            <Paper className="p-8 w-full max-w-3xl shadow-lg py-16">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Add New Project</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Title"
                            name="title"
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            value={project.title}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Location"
                            name="location"
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            value={project.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Price"
                            name="price"
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            value={project.price}
                            onChange={handleChange}
                        />
                        <FormControl variant="outlined" size="small" fullWidth required>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={project.category}
                                onChange={handleCategoryChange}
                                label="Category"
                            >
                                <MenuItem value="Commercial">Commercial</MenuItem>
                                <MenuItem value="Residential">Residential</MenuItem>
                                <MenuItem value="Industrial">Industrial</MenuItem>
                                <MenuItem value="Agricultural">Agricultural</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Autocomplete
                        clearIcon={false}
                        options={project.tags}
                        freeSolo
                        multiple
                        value={project.tags}
                        onChange={handleItemChange}
                        renderItems={handleRenderItems}
                        renderInput={handleRenderInput}
                        renderOption={(props, option, { selected }) => (
                            <li {...props} key={option} className="flex flex-row items-center justify-between px-4 py-2">
                                <span>
                                    {option}
                                </span>
                                {selected ?
                                    <DoneIcon className='text-green-700' />
                                    : null}
                            </li>
                        )}
                    />
                    <ReactQuill
                        value={project.description}
                        onChange={handleDescriptionChange}
                        className="h-40"
                        theme="snow"
                        modules={modules}
                        formats={formats}
                    />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none !mt-24"
                    />
                    {project.pictures.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {project.pictures.map((picture, index) => (
                                <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                                    <Image
                                        src={picture}
                                        alt="Project"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-end mt-6">
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Add Project'}
                        </Button>
                    </div>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </form>
            </Paper>
        </div>
    );
};

export default Page;
