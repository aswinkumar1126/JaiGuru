import { useState } from 'react';
import styles from './Search.module.css';

function Search() {
    const [search, setSearch] = useState('');

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        // console.log('Searching for:', search);
        setSearch('');
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search items here..."
                className={styles.searchInput}
                value={search}
                onChange={handleChange}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                🔍
            </button>
        </div>
    );
}

export default Search;
