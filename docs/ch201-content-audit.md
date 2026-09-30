# CH201 Content Audit

Audit date: 2026-09-30

## Evidence boundary

The implementation brief is the available content handoff. The reported `FullText.md`, `FullWork.md`, and source textbook/workbook files are not present in this checkout. Page-level source verification therefore remains pending. Original practice and generalized, adapted class answers are labeled separately in the shipped records.

No private journals or inferred personal details were added.

## Canonical vocabulary mappings

All 15 weekly items resolve to the existing Pathway 03 JSON records. Coordinates use the source lesson/deck and zero-based card index used by the application.

| Stable ID | Traditional | Pathway / waypoint / deck / index | Status |
| --- | --- | --- | --- |
| `v3-kaixue` | 開學 | 03 / 01 / A / 0 | Resolved |
| `v3-xinsheng` | 新生 | 03 / 01 / A / 1 | Resolved |
| `v3-bijiao` | 比較 | 03 / 01 / A / 10 | Resolved |
| `v3-banjia` | 搬家 | 03 / 01 / B / 4 | Resolved |
| `v3-shiying` | 適應 | 03 / 01 / B / 2 | Resolved |
| `v3-shengqian` | 省錢 | 03 / 01 / A / 11 | Resolved |
| `v3-ziyou` | 自由 | 03 / 01 / A / 12 | Resolved |
| `v3-haochu` | 好處 | 03 / 01 / B / 1 | Resolved |
| `v3-bangmang` | 幫忙 | 03 / 01 / B / 5 | Resolved |
| `v3-chusheng` | 出生 | 03 / 01 / A / 4 | Resolved |
| `v3-dong` | 棟 | 03 / 02 / A / 10 | Resolved |
| `v3-riyongpin` | 日用品 | 03 / 02 / A / 13 | Resolved |
| `v3-yiban` | 一般 | 03 / 02 / B / 6 | Resolved |
| `v3-canguanr` | 餐館兒 | 03 / 02 / B / 9 | Resolved; erhua preserved |
| `v3-didao` | 地道 | 03 / 02 / B / 10 | Resolved in “authentic” context |

Weekly collections reference these same IDs, so duplicate appearances do not create duplicate progress identities.

## Grammar reuse

The pack links directly to existing ZiLu grammar references where the scope aligns:

- Place + 有 + thing → `location#point-you-existence`
- Subject + 在 + place + action → `location#point-zai-place-verb`
- Topic + comment → `basics#point-topic-first`
- Noun + location expression → related location reference

比較 + adjective, 要 + order, experience 過, and 是…的 use small pack-local explanations because the existing grammar reference does not currently expose an exact matching record. These are contextual teaching overlays, not duplicate vocabulary records.

## Character collection

The 30 characters are stored as a curated supplied order. No occurrence counts or frequency-rank claims are published. 什 and 麼 are explicitly taught through the complete word 什麼. Existing Hanzi Writer data and fallback loading power optional writing practice.

## Validation

Static validation checks duplicate IDs, missing pack/unit/source/content references, invalid choice answers, inconsistent sentence-order token sets, empty required example text, and non-public bundled examples. Targeted tests cover reference rejection, stable-answer validation, review priority/filtering, and malformed/unknown storage fallback.

## Remaining verification

- Confirm exact source locators against lawful local textbook/workbook material.
- Review sentence pinyin and the displayed lexical-versus-spoken tone-sandhi convention with a qualified Traditional Chinese reviewer.
- Review all generalized examples for regional register and naturalness.
- Add reviewed audio before claiming pronunciation quality or offline audio coverage.
