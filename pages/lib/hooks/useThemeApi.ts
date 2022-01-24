import React, {useContext} from "react";

export const ThemeApi = React.createContext<{ toggleTheme?: () => void }>({})
export const useThemeApi = () => useContext(ThemeApi);
