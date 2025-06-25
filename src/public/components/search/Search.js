import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate
import styles from './Search.module.css';

function Search({ onSearchComplete }) {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        if (search.trim()) {
            navigate(`/search?itemName=${encodeURIComponent(search.trim().toLowerCase())}`);
            if (onSearchComplete) onSearchComplete();
        }
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search items here..."
                className={styles.searchInput}
                value={search}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // enter support
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                🔍
            </button>
        </div>
    );
}

export default Search;
