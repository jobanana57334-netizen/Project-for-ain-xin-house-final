import { ChevronLeft, ChevronRight } from "lucide-react";


function PropertyPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate a small sliding window of pages
  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination">
      <button type="button" className="pagination__arrow" onClick={handlePrev} disabled={currentPage === 1}>
        <ChevronLeft size={16} />
      </button>

      {pages[0] > 1 && (
        <>
          <button type="button" className="pagination__number" onClick={() => onPageChange(1)}>
            1
          </button>
          {pages[0] > 2 && <span className="pagination__ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button key={page} type="button" className={`pagination__number ${currentPage === page ? "is-active" : ""}`} onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="pagination__ellipsis">...</span>}
          <button type="button" className="pagination__number" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button type="button" className="pagination__arrow" onClick={handleNext} disabled={currentPage === totalPages}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default PropertyPagination;
