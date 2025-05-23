// ThemeContext.js
import { createContext, useState, useEffect } from 'react';

// Create a context to share theme state globally
export const ThemeContext = createContext();

 const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState('light');
  const [isAuth,setIsAuth]= useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);

     const savedAuth = localStorage.getItem('isAuth') === 'true';
     setIsAuth(savedAuth);

    //document.body.className = savedTheme;

    // if(theme === "light"){
    //     document.documentElement.classList.add("light")
    // }
    // else{
    //     document.documentElement.classList.remove("light")
    // }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
   // document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);

  //  setTheme(theme === "light" ? "dark":"light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme,isAuth, setIsAuth }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider