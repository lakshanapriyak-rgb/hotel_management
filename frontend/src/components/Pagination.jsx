function Pagination({ page, totalPages, onPageChange }) {
  const pages=[];
  for (let i=1;i<=totalPages;i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      <button disabled={page===1} onClick={() =>onPageChange(page-1)}>
        Prev
      </button>


      {pages.map((n)=>(
        <button
          key={n}
          className={n===page ? "active" : ""}
          onClick={()=>onPageChange(n)}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page===totalPages}
        onClick={()=>onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
export default Pagination;