Review the pull request given as an argument (PR number or URL). Usage: /review-pr 42

1. Fetch the PR details: `gh pr view <arg> --json title,body,headRefName,baseRefName,files`
2. Fetch the diff: `gh pr diff <arg>`
3. Review the changes with focus on:
   - **Correctness** — logic errors, edge cases missed in `generate`, `isTTID`, or `decodeTime`.
   - **Type safety** — use of `any` instead of `unknown`, missing type guards.
   - **Tests** — whether new behaviour is covered in `test/ttid.test.ts`; flag any missing cases.
   - **Public API** — unintended changes to `src/types/ttid.d.ts`.
   - **CI** — whether the workflow files in `.github/workflows/` are still valid for the change.
4. Post the review as inline comments using `gh pr review <arg> --comment --body "<feedback>"`.
   Group feedback by file. Prefix each point with **[suggestion]**, **[issue]**, or **[nit]**.
5. Summarise the overall verdict: Approve / Request changes / Comment only.
