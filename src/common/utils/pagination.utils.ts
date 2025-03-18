export function transformPaginationQuery({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const from = Math.max(page - 1, 0) * limit;

  return {
    from,
    to: from + limit - 1,
  };
}

export function transformPaginationResponse({
  total,
  page = 1,
  limit = 10,
}: {
  total: number;
  page?: number;
  limit?: number;
}) {
  return {
    total,
    totalPage: Math.ceil(total / limit),
    page,
    limit,
  };
}
