import { useNavigate } from "react-router-dom";

export const goToPageByNameWithId = (
  navigate: ReturnType<typeof useNavigate>,
  name: string,
  id: string,
  query?: Record<string, any>
) => {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : "";
  navigate(`/${name}/${id}${searchParams}`);
};
