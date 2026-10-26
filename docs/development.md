# Working on the SDK

## What is written by hand and what is generated

| Path                                                                                    |                                                                                                        |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/client.ts`, `src/core/`, `src/webhooks.ts`, `src/index.ts`, `src/testing/index.ts` | Written by hand: transport, retries, errors, paging, validation, webhook verification, the fake.       |
| `src/generated/`, `src/testing/examples.ts`, `test/generated/`                          | **Generated** from `spec/public.yaml` and `spec/partner.yaml`. Never edit: the next run overwrites it. |
| `generator/`                                                                            | The generator and its `config.ts`.                                                                     |
| `spec/`                                                                                 | A copy of the backend's bundled OpenAPI documents; `spec/SOURCE` is the backend commit they come from. |

Every generated file starts with a comment that says so.

## Commands

Node.js 22 (any version from 20 runs the SDK; the tooling wants 20 too).

```bash
npm ci
npm run check          # types (including the generated type checks), style, tests, build
npm test -- webhook    # one test file
npm run generate       # regenerate from spec/ (formats with Prettier)
npm run fresh          # fail when the generated code differs from what the spec produces (CI runs the same check)
npm run format         # Prettier over everything
```

## When the API changes

1. In the backend, change the fragments under `openapi/` and bundle them as usual. Merge.
2. Here: `npm run spec:sync -- ../mycomm-backend`, then `npm run generate`.
3. Read the diff. New endpoints, fields, enum values and events appear by themselves.
4. `npm run check`. The generated tests call every operation with example arguments and read two answers per operation, and
   the generated type checks hold every example against its type, so a spec change the generator cannot express fails here,
   with the operation's name.
5. Add a line to `CHANGELOG.md` and release: a **minor** version for additions, a **major** one when a method, parameter or
   field was removed or changed type.

The API only makes additive changes within `/v1`, so regenerating is normally a minor release. Keep the PHP SDK in step:
both are generated from the same `spec/` commit.

## What the generator decides and what you decide

The generator follows fixed rules (`generator/`):

- The SDK name `a.b.c` of an operation becomes `client.a.b.c()`. Ids in the path are the leading arguments, then one
  `params` object with the body fields and query parameters (named `ABCParams`), then `options`.
- A response of `{data, next_cursor}` becomes a `Page`; a `list` operation with a `cursor` also gets `all()`.
- A list of two or more string values becomes an enum: a union type and a constant object of the same name. Results type it
  `Open<Name>`, because the API may add values; parameters take the union itself.
- An operation with a `dry_run` field whose answers differ (a "Dry run" status and another) gets overloads on `dry_run`.
- Timestamps stay strings in results and accept `Date | string` in parameters.
- An input object that shares a name with a model becomes `NameInput`; a resource class is `NameResource`.

`generator/config.ts` holds the few things the spec cannot say. It follows `generator/config.php` of mycomm-php; change both
together:

- `operations`: the SDK name of each operation id. A new operation fails the generator until it is named here.
- `enums`: a name for a list of values that appears in several places, so they share one type.
- `models`: a name for an answer the spec describes inline.
- `nullable`: a field the real API returns as `null` although the spec says it never is. Each entry is a spec bug: fix the
  backend spec and the generator will tell you to delete the entry.
- `multipart`: the method name of the upload variant of an operation that also takes JSON.

The generator stops with a message, instead of guessing, when two schemas want one type name, when lists that share an enum
name drift apart, or when two operations of a resource would share a method name.

## Before a release

1. `npm run check`.
2. Check the package as a user gets it: `npm pack`, install the tarball into an empty project with `typescript` and
   `@types/node`, and compile an `.mts` file that imports `@mycomm/node` and `@mycomm/node/testing` and a `.cts` file that
   does the same, with `"module": "NodeNext"`; run both.
3. Run the SDK against a test account: send a dry run, list messages, create and delete a webhook endpoint, and verify a
   delivery signed by the backend's test action (`webhookEndpoints.test`).
4. Bump `version` in `package.json` and `VERSION` in `src/core/version.ts` in the same commit, tag `vX.Y.Z`, and publish
   with `npm publish --access public`.
