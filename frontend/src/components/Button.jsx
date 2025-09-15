const Button = ({ 
  children, 
  onClick, 
  type = "button",
  className = "", 
  disabled = false 

}) => {
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`mt-2 w-full text-md cursor-pointer py-2 px-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded shadow-xs transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
