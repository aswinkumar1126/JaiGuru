import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CategorySection.css";
import goldIcon from "../../assets/icons/gold.jpg";
import silverIcon from "../../assets/icons/silver.jpg";
import diamondIcon from "../../assets/icons/diamond.avif";
import allProductsIcon from "../../assets/icons/gold.jpg"; // Renamed for clarity

const categories = [
    { label: "Gold", id: "G", icon: goldIcon },
    { label: "Silver", id: "S", icon: silverIcon },
    { label: "Diamond", id: "D", icon: diamondIcon },
    { label: "All Products", id: "", icon: allProductsIcon },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
    hover: { y: -5, scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } },
};

function CategorySection() {
    const navigate = useNavigate();

    return (
        <section className="category-section">
            <motion.h2
                className="category-title"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                Shop by Category
            </motion.h2>
            <motion.div
                className="category-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        className="category-card"
                        onClick={() => navigate(`/products?metalId=${cat.id}`)}
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="icon-container">
                            <img src={cat.icon} alt={cat.label} className="category-icon" />
                        </div>
                        <span className="category-label">{cat.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

export default CategorySection;