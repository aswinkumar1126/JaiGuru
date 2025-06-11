import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const CustomButton = ({
    label,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    variant = 'primary',  // 'primary', 'secondary', 'text'
    size = 'medium',  // 'small', 'medium', 'large'
    icon = null,
    isLoading = false,
    ariaLabel = null
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            aria-label={ariaLabel || label}
            className={`custom-button ${variant} ${size} ${className} 
                ${disabled ? 'disabled' : ''} ${isLoading ? 'loading' : ''}`}
        >
            {isLoading ? (
                <span className="button-loader" aria-hidden="true" />
            ) : (
                <>
                    {icon && <span className="button-icon">{icon}</span>}
                    <span className="button-label">{label}</span>
                </>
            )}
        </button>
    );
};

CustomButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'text']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    icon: PropTypes.element,
    isLoading: PropTypes.bool,
    ariaLabel: PropTypes.string
};

export default CustomButton;
