import ReactDOM from 'react-dom';

const DropdownPortal = ({ children }) => {
    const mountNode = document.getElementById('dropdown-root');
    return mountNode ? ReactDOM.createPortal(children, mountNode) : null;
};

export default DropdownPortal;
