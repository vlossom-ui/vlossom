import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function resolveComponentsPath(): string | null {
    const envPath = process.env["VLOSSOM_COMPONENTS_PATH"];
    if (envPath) {
        return resolve(envPath);
    }

    // 모노레포 내 개발 환경: packages/vlossom-mcp/dist/utils/ -> packages/vlossom/src/components
    const monorepoPaths = [
        resolve(__dirname, "../../../vlossom/src/components"),
        resolve(__dirname, "../../../../packages/vlossom/src/components"),
    ];

    for (const candidate of monorepoPaths) {
        if (existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
}
