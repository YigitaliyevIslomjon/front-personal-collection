import React from "react";
import { Route, Routes } from "react-router-dom";
import { menuItems } from "../data/menuItems";

function Root() {
  return (
    <Routes>
      {menuItems.map((item) => {
        const { Element } = item;
        if (item.hasOwnProperty("children")) {
          return (
            <Route key={item.id} path={item.path} element={<Element />}>
              {item.children.map((child) => {
                const { Element } = child;
                return (
                  <Route
                    key={child.id}
                    path={child.path}
                    element={<Element />}
                  />
                );
              })}
            </Route>
          );
        }
        return <Route key={item.id} path={item.path} element={<Element />} />;
      })}
    </Routes>
  );
}

export default Root;
