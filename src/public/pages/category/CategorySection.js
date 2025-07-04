import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./CategorySection.css";
import goldIcon from "../../assets/icons/gold.jpg";
import silverIcon from "../../assets/icons/silver.jpg";
import diamondIcon from "../../assets/icons/pooja.jpg";
import allProductsIcon from "../../assets/icons/gift.jpg";
import others from '../../assets/icons/other.jpg';

const jewelryCategories = [
    { label: "Silver Gold Polish", id: "G", icon: goldIcon },
    { label: "Silver Jewels", id: "S", icon: silverIcon },
    { label: "Pooja sets", id: "D", icon: diamondIcon },
    { label: "Gift Items", id: "O", icon: allProductsIcon },
    { label: 'Others', id: "T", icon: others }
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
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

function CategorySection() {
    const navigate = useNavigate();
    const gridRef = useRef(null);

    const scroll = (direction) => {
        if (gridRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            gridRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="jewelry-categories-section">
            <div className="jewelry-categories-container">
                <motion.h2
                    className="jewelry-categories-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Our Collections
                </motion.h2>

            

                <motion.div
                    className="jewelry-categories-grid"
                    ref={gridRef}
                    variants={containerAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                >
                    {jewelryCategories.map((category) => (
                        <motion.div
                            key={category.id}
                            className="jewelry-category-card"
                            variants={cardAnimation}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/products?metalId=${category.id}`)}
                        >
                            <div className="jewelry-category-img-container">
                                <img
                                    src={category.icon}
                                    alt={category.label}
                                    className="jewelry-category-img"
                                    loading="lazy"
                                />
                                <div className="jewelry-category-shine"></div>
                            </div>
                            <span className="jewelry-category-name">
                                {category.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

              
            </div>
        </section>
    );
}

export default CategorySection;