

// BaseURLInput.js
import React, { useState } from 'react';
import { Input, Button, Spin, message } from 'antd';
// Compose.js
import axios from 'axios';


const BaseURLInput = ({ onSubmit, loading }) => {
    const [baseURLs, setBaseURLs] = useState('');

    const handleInputChange = (e) => {
        setBaseURLs(e.target.value);
    };

    const handleSubmit = () => {
        if (!baseURLs.trim()) {
            message.error('Please enter at least one base URL');
            return;
        }
        const urls = baseURLs.split('\n').filter(url => url.trim());
        onSubmit(urls);
    };

    return (
        <div>
            <Input.TextArea
                placeholder="Enter base URLs (one per line)"
                autoSize={{ minRows: 3, maxRows: 6 }}
                onChange={handleInputChange}
            />
            <Button type="primary" onClick={handleSubmit} loading={loading}>
                {loading ? <Spin /> : 'Submit'}
            </Button>
        </div>
    );
};





const Compose = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmitBaseURLs = async (baseURLs) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/process_articles/', { base_urls: baseURLs });
            console.log(response.data);
            message.success('Base URLs submitted successfully!');
        } catch (error) {
            console.error('Error:', error);
            message.error('Error occurred while submitting base URLs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Enter Base URLs</h1>
            <BaseURLInput onSubmit={handleSubmitBaseURLs} loading={loading} />
        </div>
    );
};

export default Compose;


