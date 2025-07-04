import { useQuery } from '@tanstack/react-query';
import { getItemAndSubItemNames } from '../../service/CategoryItemsService';
import { getItemFilter } from  '../../service/CategoryItemsService';

export const useItemNames = (metal) => {
    return useQuery({
        queryKey: ['itemNames', metal],
        queryFn: () => getItemAndSubItemNames(metal),
        enabled: !!metal, // Only fetch if metal is truthy
        staleTime: 5 * 60 * 1000, // optional: cache for 5 minutes
    });
  };

export const useItemFilter = ({ itemId, itemName, page = 1, pageSize = 20 }) => {
  return useQuery({
    queryKey: ['itemFilter', itemId, itemName, page, pageSize],
    queryFn: () => getItemFilter({
      itemId: itemId ? itemId.toString() : undefined,
      itemName: itemName ? itemName.trim() : undefined,
      page,
      pageSize
    }),
    enabled: !!itemId || !!itemName,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  });
  };