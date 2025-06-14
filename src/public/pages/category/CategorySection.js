import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CategorySection.css";
import goldIcon from "../../assets/icons/gold.jpg";
import silverIcon from "../../assets/icons/silver.jpg";
import diamondIcon from "../../assets/icons/diamond.avif";
import AllProuctsIcon from "../../assets/icons/gold.jpg";

const categories = [
    { label: "Gold", id: "G", icon: goldIcon },
    { label: "Silver", id: "S", icon: silverIcon },
    { label: "Diamond", id: "D", icon: diamondIcon },
    { label: "All Products", id: "", icon: AllProuctsIcon },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    },
    hover: {
        y: -10,
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10
        }
    }
};

function CategorySection() {
    const navigate = useNavigate();

    const handleClick = (metalId) => {
        navigate(`/products?metalId=${metalId}`);
    };

    return (
        <section className="category-section">
            <motion.h2
                className="category-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
            >
                Shop by Category
            </motion.h2>

            <motion.div
                className="category-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        className="category-card"
                        onClick={() => handleClick(cat.id)}
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