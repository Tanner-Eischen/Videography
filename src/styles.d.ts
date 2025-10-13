// Allow importing plain CSS (and SCSS) files from TypeScript files.
// This is useful for global styles like Tailwind's generated CSS.
declare module '*.css' {
  const content: { [className: string]: string } | string;
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string } | string;
  export default content;
}

export {};
