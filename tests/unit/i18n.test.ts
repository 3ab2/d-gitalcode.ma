import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

type Tree = { [key: string]: unknown };

const LOCALES = ["en", "fr", "ar"] as const;

function load(locale: string): Tree {
  return JSON.parse(
    fs.readFileSync(path.join("messages", locale, "common.json"), "utf8")
  );
}

function flatten(tree: Tree, prefix = "", out = new Set<string>()): Set<string> {
  for (const [key, value] of Object.entries(tree)) {
    out.add(prefix + key);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value as Tree, `${prefix}${key}.`, out);
    }
  }
  return out;
}

function sources(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sources(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

test("every locale has the same keys", () => {
  const reference = flatten(load("en"));
  for (const locale of LOCALES) {
    const keys = flatten(load(locale));
    assert.deepEqual(
      [...reference].filter((k) => !keys.has(k)),
      [],
      `missing in ${locale}`
    );
    assert.deepEqual(
      [...keys].filter((k) => !reference.has(k)),
      [],
      `only in ${locale}`
    );
  }
});

test("every key used in the code exists", () => {
  const keys = flatten(load("en"));
  const missing: string[] = [];
  for (const file of sources("src")) {
    const text = fs.readFileSync(file, "utf8");
    for (const [, key] of text.matchAll(/\bt\(\s*["']([\w.-]+)["']/g)) {
      if (!keys.has(key)) missing.push(`${key} (${file})`);
    }
    for (const [, prefix] of text.matchAll(/\bt\(\s*`([\w.]+)\.\$\{/g)) {
      if (!keys.has(prefix)) missing.push(`${prefix}.* (${file})`);
    }
  }
  assert.deepEqual(missing, []);
});

test("no message is empty", () => {
  for (const locale of LOCALES) {
    const walk = (value: unknown, at: string): void => {
      if (typeof value === "string") {
        assert.notEqual(value.trim(), "", `${locale} ${at}`);
      } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) walk(v, `${at}.${k}`);
      }
    };
    walk(load(locale), "");
  }
});
