const BASE_URL = import.meta.env.VITE_API_URL || 'https://socialmedia-backend-zng2.onrender.com/api';

export const uploadApi = {
    uploadImage: async (file) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload image');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    getImageUrl: (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${BASE_URL.replace('/api', '')}/${imagePath}`;
    },
};