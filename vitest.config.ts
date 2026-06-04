import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import { baseConfig } from "./vite.config";

export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            environment: "jsdom",
            exclude: [...configDefaults.exclude, "e2e/**", "playwright/**/**"],
            root: fileURLToPath(new URL("./", import.meta.url)),
            reporters: process.env.ON_JENKINS ? "junit" : "default",
            outputFile: "tests-reports/unit/junit.xml",
        }
    })
);
