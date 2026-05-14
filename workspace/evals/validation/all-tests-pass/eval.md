---
name: all-tests-pass
type: eval
---

<Eval>
    <Subject>
        Validates that all project tests pass by running `npm test` (vitest).
    </Subject>
    <Evaluation>
        <Deterministic>
            - test_all_tests_pass: Runs `npm test` and checks exit code is 0
        </Deterministic>
    </Evaluation>
    <Remediation>
        <Instructions>
            1. Review the test output to identify failing tests
            2. Fix the failing tests or the code they're testing
            3. Re-run the eval: `dart workspace/evals/validation/all-tests-pass/eval.dart`
        </Instructions>
        <Tools>
            - dart workspace/evals/validation/all-tests-pass/eval.dart
            - npm test
        </Tools>
    </Remediation>
</Eval>
