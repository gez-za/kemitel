import { defineConfig as openapiTsDefineConfig } from "@hey-api/openapi-ts";

export const config = ({ input, name }: { input: string; name: string }) =>
  openapiTsDefineConfig({
    input: input,
    output: {
      path: `./src/api/${name}`,
      format: "prettier",
      lint: "eslint",
    },
    plugins: [
      "@hey-api/schemas",
      "@hey-api/client-axios",
      {
        enums: 'typescript',
        name: '@hey-api/typescript',
      },
      {
        name: "@hey-api/sdk",
        asClass: true,
      },
      {
        identifierCase: "preserve",
        name: "@hey-api/typescript",
      },
    ],
  });
