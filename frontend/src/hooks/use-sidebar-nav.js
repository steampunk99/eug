import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Define a color theme object for consistent styling
export const sidebarTheme = {
  colors: {
    primary: {
      default: 'bg-gradient-to-r from-blue-500/10 to-purple-500/10',
      hover: 'hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20',
      active: 'bg-gradient-to-r from-blue-500/30 to-purple-500/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500 dark:text-blue-400',
    },
    secondary: {
      default: 'bg-gray-100 dark:bg-gray-800',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
      active: 'bg-gray-300 dark:bg-gray-600',
      text: 'text-gray-700 dark:text-gray-300',
      icon: 'text-gray-500 dark:text-gray-400',
    },
    accent: {
      default: 'bg-gradient-to-r from-indigo-500/10 to-pink-500/10',
      hover: 'hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20',
      active: 'bg-gradient-to-r from-indigo-500/30 to-pink-500/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      icon: 'text-indigo-500 dark:text-indigo-400',
    },
  },
  transitions: {
    default: 'transition-all duration-200 ease-in-out',
    smooth: 'transition-all duration-300 ease-in-out',
  },
  effects: {
    hover: 'hover:shadow-md dark:hover:shadow-gray-800',
    active: 'shadow-inner',
    glow: 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50',
  },
};

// Style utility functions
export const getItemStyle = (isActive, isHovered = false) => {
  const theme = sidebarTheme;
  const baseStyle = 'rounded-lg px-3 py-2 ' + theme.transitions.default;
  
  if (isActive) {
    return `${baseStyle} ${theme.colors.primary.active} ${theme.colors.primary.text} ${theme.effects.active}`;
  }
  
  return `${baseStyle} ${theme.colors.secondary.default} ${theme.colors.secondary.text} ${theme.colors.secondary.hover} ${theme.effects.hover}`;
};

export const getGroupStyle = (isExpanded, hasActiveChild) => {
  const theme = sidebarTheme;
  const baseStyle = 'rounded-lg ' + theme.transitions.smooth;
  
  if (hasActiveChild || isExpanded) {
    return `${baseStyle} ${theme.colors.accent.default} ${theme.colors.accent.text}`;
  }
  
  return `${baseStyle} ${theme.colors.secondary.default} ${theme.colors.secondary.text} ${theme.colors.secondary.hover}`;
};

export function useSidebarNav() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Update active item based on current route
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  // Toggle menu group expansion
  const toggleGroup = useCallback((groupTitle) => {
    setExpandedGroups((current) => {
      const isExpanded = current.includes(groupTitle);
      if (isExpanded) {
        return current.filter((title) => title !== groupTitle);
      } else {
        return [...current, groupTitle];
      }
    });
  }, []);

  // Handle hover states
  const handleItemHover = useCallback((path) => {
    setHoveredItem(path);
  }, []);

  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Check if a menu item is active
  const isActiveItem = useCallback((path) => {
    if (!path) return false;
    return location.pathname === path;
  }, [location]);

  // Check if a menu group is expanded
  const isGroupExpanded = useCallback((groupTitle) => {
    return expandedGroups.includes(groupTitle);
  }, [expandedGroups]);

  // Check if any child in a group is active
  const isGroupActive = useCallback((items) => {
    if (!items) return false;
    return items.some((item) => isActiveItem(item.path));
  }, [isActiveItem]);

  // Get styles for an item
  const getItemStyles = useCallback((path) => {
    const isActive = isActiveItem(path);
    const isHovered = hoveredItem === path;
    return getItemStyle(isActive, isHovered);
  }, [isActiveItem, hoveredItem]);

  // Get styles for a group
  const getGroupStyles = useCallback((groupTitle, items) => {
    const isExpanded = isGroupExpanded(groupTitle);
    const hasActiveChild = isGroupActive(items);
    return getGroupStyle(isExpanded, hasActiveChild);
  }, [isGroupExpanded, isGroupActive]);

  return {
    activeItem,
    hoveredItem,
    isActiveItem,
    isGroupExpanded,
    isGroupActive,
    toggleGroup,
    handleItemHover,
    handleItemLeave,
    getItemStyles,
    getGroupStyles,
  };
}
