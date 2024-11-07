import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../../store/slices/postSlice";
import { useState, useEffect } from "react";

const SearchInput = () => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const { posts, total } = useSelector(state => state.post);

    useEffect(() => {
        if (searchText) {
            dispatch(getAllPosts({ offset: 2, limit: 30, search: searchText }));
        }
    }, [searchText]);

    console.log(searchText);

    return (
        <div className="searchInput">
            <div className="searchInput-wrapper">
                <input
                    id="search"
                    type="text"
                    placeholder={""}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>


        </div>
    );
};

export default SearchInput;