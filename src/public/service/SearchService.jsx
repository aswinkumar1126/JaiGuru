import PublicUrl from "../api/publicUrl";

export const itemService = {
    filterItems: (params) =>
        PublicUrl.post("product/items/filter", null, { params }),
  };