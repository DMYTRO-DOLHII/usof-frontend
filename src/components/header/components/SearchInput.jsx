import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, setSearch } from "../../../store/slices/postSlice";
import { useState, useEffect, useCallback } from "react";

const SearchInput = () => {
    const dispatch = useDispatch();
    const { posts, total, search } = useSelector((state) => state.post);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearch !== search) {
                dispatch(setSearch(debouncedSearch));
                dispatch(getAllPosts({ offset: 2, limit: 30, search: debouncedSearch }));
            }
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timer); // Clear timer on cleanup or new input
    }, [debouncedSearch, dispatch, search]);

    const handleSearchChange = (e) => {
        setDebouncedSearch(e.target.value);
    };

    return (
        <div className="d-flex me-auto ms-auto w-50">
            <input
                className="form-control me-2 w-100"
                id="search"
                type="text"
                placeholder="Search..."
                value={debouncedSearch}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default SearchInput;
