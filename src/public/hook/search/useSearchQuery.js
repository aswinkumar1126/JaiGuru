import { itemService } from "../../service/SearchService";
import { useQuery } from "@tanstack/react-query";

export const useFilteredItems = (filterParams) => {
    return useQuery({
        queryKey: ["filteredItems", filterParams],
        queryFn: () => itemService.filterItems(filterParams),
        enabled: !!filterParams, // ensures query doesn't run until filters exist
    });
  };