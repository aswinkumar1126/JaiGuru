// utils/getPageTitle.js
export const getPageTitle = (pathname, menuItems) => {
    // Check main routes first
    const mainItem = menuItems.find(item => item.path === pathname);
    if (mainItem) return mainItem.title;

    // Check submenu routes
    for (const item of menuItems) {
        if (item.submenu) {
            const subItem = item.submenu.find(sub => sub.path === pathname);
            if (subItem) return `${item.title} > ${subItem.title}`;
        }
    }

    return "Admin Dashboard"; // Default title
};