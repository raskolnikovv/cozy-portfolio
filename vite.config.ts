import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Keep optional model loaders out of the eagerly shared R3F/Three chunks.
            {
              name: 'gltf',
              test: /node_modules[\\/](?:@react-three[\\/]drei[\\/]core[\\/](?:Gltf|Clone)\.|three-stdlib[\\/](?:loaders[\\/](?:GLTFLoader|DRACOLoader)\.|libs[\\/]MeshoptDecoder\.)|three[\\/]examples[\\/]jsm[\\/]utils[\\/]SkeletonUtils\.)/,
              priority: 30,
              includeDependenciesRecursively: false,
            },
            { name: 'three', test: /node_modules[\\/]three[\\/]/, priority: 20 },
            { name: 'react-three', test: /node_modules[\\/]@react-three[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})
