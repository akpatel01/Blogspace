const BASE_URL = import.meta.env.VITE_API_URL || 'https://socialmedia-backend-zng2.onrender.com/api';

export const blogApi = {
    getAllBlogs: async () => {
        try {
            const response = await fetch(`${BASE_URL}/blog/all-blog`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch blogs');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    getBlogById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/blog/get-blog/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch blog');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    getUserBlogs: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/blog/user-blog/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch user blogs');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    createBlog: async (blogData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${BASE_URL}/blog/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create blog');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    updateBlog: async (id, blogData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/blog/update-blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update blog');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    deleteBlog: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/blog/delete-blog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete blog');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
};