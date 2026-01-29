// src/router/sidebarLink.js

export const menuLinks = [
  {
    name: "Home",
    path: "/app/home",
    iconComponent: "HomeIcon", 
    requiredRoles: ["guest", "user", "admin", "dev"],
  },
  {
    name: "Board",
    path: "/app/board",
    iconComponent: "GlobeAltIcon",
    requiredRoles: ["guest", "user", "admin", "dev"],
  },
  {
    name: "About",
    path: "/app/about",
    iconComponent: "InformationCircleIcon",
    requiredRoles: ["guest", "user", "admin", "dev"],
  },
  {
    name: "News",
    path: "/app/news",
    iconComponent: "NewspaperIcon",
    requiredRoles: ["user", "admin", "dev"],
  },
  {
    name: "Settings",
    path: "/app/settings",
    iconComponent: "CogIcon",
    requiredRoles: ["user", "admin", "dev"],
  },
  {
    name: "User Management",
    path: "/app/admin/users",
    iconComponent: "UsersIcon",
    requiredRoles: ["admin", "dev"],
  },
  {
    name: "System Logs",
    path: "/app/dev/logs",
    iconComponent: "CommandLineIcon",
    requiredRoles: ["dev"],
  },
  // {
  //   name: "PeopleCounter",
  //   path: "/app/peoplecounter",
  //   iconComponent: "CogIcon",
  //   requiredRoles: ["user", "admin", "dev"],
  // },
  
  
  
];