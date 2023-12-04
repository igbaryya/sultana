{
    "compilerOptions": {
      "target": "ESNext",
      "module": "ESNext", // Use ESNext module for React
      "moduleResolution": "node",
      "jsx": "react-jsx", // Enable JSX support
      "outDir": "./dist/",
      "allowJs": true,
      "removeComments": true,
      "resolveJsonModule": true,
      "typeRoots": ["./node_modules/@types"],
      "sourceMap": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "esModuleInterop": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "skipLibCheck": true,
      "lib": ["es2018", "dom", "esnext.asynciterable"],
      "baseUrl": "./",
    },
    "include": [
      "index.tsx",
      "src/index.d.ts",
      "src/",
      "src/**/*.tsx", // Include TSX files
      "src/**/*.d.ts"
    ],
    "exclude": ["node_modules"]
}