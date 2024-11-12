import React from 'react';
import './Pagination.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const maxVisibleButtons = 5;

    // Calculate the page numbers to display
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...', totalPages);
            } else if (currentPage > totalPages - 3) {
                pageNumbers.push(1, '...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1, '...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...', totalPages);
            }
        }

        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (page === currentPage) return;
        onPageChange(page);
    };

    return (
        <div className="pagination d-flex justify-content-center align-items-center">
            <button
                className="pagination-button prev-next"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            {getVisiblePageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                    <button
                        key={index}
                        className={`pagination-button ${page === currentPage ? 'active' : 'not-active'}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="pagination-ellipsis">{page}</span>
                )
            ))}
            <button
                className="pagination-button prev-next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
