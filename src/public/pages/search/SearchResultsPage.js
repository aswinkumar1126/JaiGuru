import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useFilteredItems } from "../../hook/search/useSearchQuery";
import ProductCard from "../../components/productCard/ProductCard";
import { useCart } from "../../hook/cart/useCartQuery";
import {
    Box,
    Typography,
    Grid,
    Container,
    Button,
    CircularProgress,
    Alert,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { AddShoppingCart, SearchOff } from "@mui/icons-material";

const SearchResultsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));
    const user = localStorage.getItem("user");
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const itemName = queryParams.get("itemName");

    // Pagination state
    const [page, setPage] = useState(1);
    const pageSize = 12; // Number of items per page
    const [allItems, setAllItems] = useState([]); // Stores all loaded items
    const [hasMore, setHasMore] = useState(true); // Tracks if more items are available

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useFilteredItems({
        itemName,
        page: page - 1, // Convert to 0-based index for backend
        pageSize
    });

    const { addToCartHandler, isAddingToCart } = useCart();

    // Combine new items with existing ones when page changes
    useEffect(() => {
        if (data?.data?.data) {
            if (page === 1) {
                setAllItems(data.data.data);
            } else {
                setAllItems(prevItems => [...prevItems, ...data.data.data]);
            }

            // Check if we've loaded all available items
            if (data.data.data.length < pageSize) {
                setHasMore(false);
            }
        }
    }, [data, page, pageSize]);

    const handleAddToCart = async (item) => {
        if (!user) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({
                    path: window.location.pathname + window.location.search
                })
            );
            navigate("/login");
            return;
        }

        try {
            await addToCartHandler({
                itemTagSno: item.SNO,
                itemId: item.ITEMID,
                subItemId: item.SubItemId,
                tagNo: item.TAGNO,
                grsWt: parseFloat(item.GRSWT),
                netWt: parseFloat(item.NETWT),
                stnWt: 0,
                stnAmount: parseFloat(item.StoneAmount || 0),
                amount: parseFloat(item.GrandTotal || 0),
                purity: parseFloat(item.PURITY),
                quantity: 1,
            });
        } catch (err) {
            console.error("Failed to add to cart:", err);
        }
    };

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (isLoading && page === 1) {
        return (
            <Container maxWidth={false} sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
                <Grid container spacing={2}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                            <Box sx={{ height: 300 }}>
                                <CircularProgress />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container maxWidth={false} sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
                <Alert severity="error">
                    Error loading search results: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search Results for "{itemName}"
                </Typography>
                {allItems.length > 0 && (
                    <Typography variant="subtitle1" color="text.secondary">
                        Showing {allItems.length} items
                    </Typography>
                )}
            </Box>

            {allItems.length === 0 && !isFetching ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "50vh",
                        textAlign: "center"
                    }}
                >
                    <SearchOff sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No items found matching your search
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            ) : (
                <>
                    <Grid container spacing={isSmallMobile ? 1 : 2}>
                        {allItems.map((item) => (
                            <Grid
                                item
                                xs={6}
                                sm={4}
                                md={3}
                                lg={2.4}
                                xl={2}
                                key={item.SNO}
                                sx={{
                                    minWidth: isSmallMobile ? '140px' : 'auto'
                                }}
                            >
                                <ProductCard
                                    product={item}
                                    onQuickView={() => navigate(`/product/${item.SNO}`)}
                                    onAddToCart={() => handleAddToCart(item)}
                                    isAddingToCart={isAddingToCart}
                                    actionIcon={<AddShoppingCart />}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {hasMore && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={loadMore}
                                disabled={isFetching}
                                startIcon={isFetching ? <CircularProgress size={20} /> : null}
                                sx={{
                                    minWidth: '200px',
                                    py: 1.5
                                }}
                            >
                                {isFetching ? 'Loading...' : 'Load More'}
                            </Button>
                        </Box>
                    )}

                    {!hasMore && allItems.length > 0 && (
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 3 }}>
                            You've reached the end of the list
                        </Typography>
                    )}
                </>
            )}
        </Container>
    );
};

export default SearchResultsPage;