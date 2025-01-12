# TypeScript Configuration (tsconfig.json)

This document explains the TypeScript configuration for the AgendaCultural project.

## Configuration Overview

The `tsconfig.json` file extends Astro's strictest TypeScript configuration and adds MDX type support.

### Base Configuration
- Extends: `astro/tsconfigs/strictest`
  - Provides strict type checking rules recommended for Astro projects
  - Includes all necessary compiler options for Astro development

### Custom Options
- `types`: ["@astrojs/mdx"]
  - Adds type definitions for MDX files
  - Enables TypeScript support for MDX components and syntax

## Recommended Practices
1. Always use TypeScript's strict mode for better type safety
2. Keep custom configuration minimal by leveraging Astro's base configurations
3. Add type definitions only for necessary integrations

For more information, see:
- [Astro TypeScript Documentation](https://docs.astro.build/en/guides/typescript/)
- [TypeScript Configuration Reference](https://www.typescriptlang.org/tsconfig)
