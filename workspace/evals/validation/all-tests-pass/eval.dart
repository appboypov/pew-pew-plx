import 'dart:io';
import '../../eval_base.dart';

/// Project-specific eval that runs `npm test` (vitest) for pew-pew-plx.
class AllTestsPassEval extends BaseEval {
  @override
  Map<String, TestFunction> get tests => {
        'test_all_tests_pass': _testAllTestsPass,
      };

  Future<TestResult> _testAllTestsPass() async {
    try {
      final result = await Process.run(
        'npm',
        ['test'],
        workingDirectory: projectRoot.path,
      ).timeout(const Duration(minutes: 5));

      if (result.exitCode == 0) {
        return (true, null);
      } else {
        final output = '${result.stdout}\n${result.stderr}';
        return (false, "npm test failed with exit code ${result.exitCode}:\n\n$output");
      }
    } on ProcessException catch (e) {
      return (false, "npm not found. Make sure Node.js is installed. Error: $e");
    } catch (e) {
      if (e.toString().contains('TimeoutException')) {
        return (false, "npm test timed out after 5 minutes");
      }
      return (false, 'Error running tests: $e');
    }
  }
}

void main() => AllTestsPassEval().run().then(exit);
