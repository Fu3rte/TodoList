interface TaskPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TaskPagination({ page, pageSize, total, onPageChange }: TaskPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
