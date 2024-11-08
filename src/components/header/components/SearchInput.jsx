import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, setSearch } from "../../../store/slices/postSlice";
import { useState, useEffect } from "react";

const SearchInput = () => {
    const dispatch = useDispatch();
    const { posts, total, search } = useSelector(state => state.post);

    useEffect(() => {
        if (search) {
            dispatch(getAllPosts({ offset: 2, limit: 30, search }));
        }
    }, [search]);

    const handleSearchChange = (e) => {
        const newSearchValue = e.target.value;
        dispatch(setSearch(newSearchValue)); // Update the search state in Redux
    };

    console.log(search);

    return (
            <div className="d-flex me-auto ms-auto w-50">
                <input
                    className="form-control me-2 w-100"
                    id="search"
                    type="text"
                    placeholder={"Search..."}
                    value={search}
                    onChange={handleSearchChange}
                />
        </div>
    );
};

export default SearchInput;