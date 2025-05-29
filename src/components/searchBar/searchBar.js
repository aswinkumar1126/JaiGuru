import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';


const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <motion.form
            className="search-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
        >
            <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                    type="search"
                    placeholder="Search dashboard..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search dashboard"
                />
                {/* {query && (
                    <button
                        type="button"
                        className="clear-button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                    >
                        &times;
                    </button>
                )} */}
            </div>
            <button
                type="submit"
                className="search-button"
                aria-label="Submit search"
            >
                Search
            </button>
        </motion.form>
    );
};

export default SearchBar;