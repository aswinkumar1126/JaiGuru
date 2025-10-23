import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "magic.css/dist/magic.min.css";
import "./CategorySection.css"; // Renamed CSS file
import goldIcon from "../../assets/icons/silver.jpg";
import silverIcon from "../../assets/icons/silver.jpg";
import diamondIcon from "../../assets/icons/diamond.avif";
import allProductsIcon from "../../assets/icons/pooja.jpg";

const jewelryCategories = [
    { label: "Gold", id: "G", icon: goldIcon },
    { label: "Silver", id: "S", icon: silverIcon },
    { label: "Diamond", id: "D", icon: diamondIcon },
    { label: "All Products", id: "", icon: allProductsIcon },
];

const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const cardAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

function CategorySection() {
    const navigate = useNavigate();

    return (
        <section className="jewelry-categories-section">
            <motion.h2
                className="jewelry-categories-title magic-animate magic-animate__fadeInDown"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Our Collections
            </motion.h2>

            <motion.div
                className="jewelry-categories-grid"
                variants={containerAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            >
                {jewelryCategories.map((category) => (
                    <motion.div
                        key={category.id}
                        className="jewelry-category-card magic-hover magic-hover__float"
                        variants={cardAnimation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            document.getElementById(`jewelry-cat-${category.id}`)
                                .classList.add('magic-click', 'magic-click__puff');
                            setTimeout(() => navigate(`/products?metalId=${category.id}`), 300);
                        }}
                        id={`jewelry-cat-${category.id}`}
                    >
                        <div className="jewelry-category-img-container magic-animate magic-animate__zoomIn">
                            <img
                                src={category.icon}
                                alt={category.label}
                                className="jewelry-category-img"
                                loading="lazy"
                            />
                            <div className="jewelry-category-shine"></div>
                        </div>
                        <motion.span
                            className="jewelry-category-name magic-animate magic-animate__slideUp"
                            whileHover={{ color: "#d4af37" }}
                        >
                            {category.label}
                        </motion.span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

export default CategorySection;