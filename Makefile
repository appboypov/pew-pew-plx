.PHONY: ready evals

# Default target: run all validation steps
ready: evals
	@echo "✓ All checks passed!"

# Run evals to validate project conventions
evals:
	@echo "Running evals..."
	dart workspace/evals/run_evals.dart
