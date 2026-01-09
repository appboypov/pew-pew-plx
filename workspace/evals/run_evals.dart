import 'dart:io';

/// Recursively finds and runs all eval.dart scripts in workspace/evals/
/// Also runs dart test for each eval's tests/ folder.
/// Runs evals in parallel for speed.
void main() async {
  final evalsDir = Directory('workspace/evals');

  print('=' * 40);
  print('Running all evals in ${evalsDir.path}');
  print('=' * 40);
  print('');

  final evalFiles = await _findEvals(evalsDir);

  if (evalFiles.isEmpty) {
    print('No evals found!');
    exit(0);
  }

  final total = evalFiles.length;
  print('Running $total evals in parallel...');
  print('');

  // Run all evals and their tests in parallel
  final futures = evalFiles.map((evalFile) async {
    final relPath = evalFile.path.replaceFirst('${evalsDir.path}/', '');

    // Run eval
    final evalResult = await Process.run(
      'dart',
      [evalFile.path],
      workingDirectory: Directory.current.path,
    );
    final evalPassed = evalResult.exitCode == 0;

    // Run tests if tests/ folder exists
    final testsDir = Directory('${evalFile.parent.path}/tests');
    bool testsPassed = true;
    bool testsSkipped = false;

    if (testsDir.existsSync()) {
      // Run tests from workspace/evals/ where pubspec.yaml lives
      final relativePath = testsDir.path.replaceFirst('${evalsDir.path}/', '');
      final testResult = await Process.run(
        'dart',
        ['test', relativePath],
        workingDirectory: evalsDir.path,
      );
      testsPassed = testResult.exitCode == 0;
    } else {
      testsSkipped = true;
    }

    return _EvalResult(
      relPath: relPath,
      evalPassed: evalPassed,
      testsPassed: testsPassed,
      testsSkipped: testsSkipped,
    );
  }).toList();

  final results = await Future.wait(futures);

  // Print results
  var evalsPassed = 0;
  var evalsFailed = 0;
  var testsPassed = 0;
  var testsFailed = 0;
  var testsSkipped = 0;

  for (final result in results) {
    final evalStatus = result.evalPassed ? 'PASS' : 'FAIL';
    final testStatus = result.testsSkipped
        ? 'SKIP'
        : (result.testsPassed ? 'PASS' : 'FAIL');

    print('${result.relPath}');
    print('  Eval: $evalStatus');
    print('  Tests: $testStatus');

    if (result.evalPassed) {
      evalsPassed++;
    } else {
      evalsFailed++;
    }

    if (result.testsSkipped) {
      testsSkipped++;
    } else if (result.testsPassed) {
      testsPassed++;
    } else {
      testsFailed++;
    }
  }

  print('');
  print('=' * 40);
  print('Results');
  print('=' * 40);
  print('Evals: $evalsPassed passed, $evalsFailed failed (of $total)');
  print('Tests: $testsPassed passed, $testsFailed failed, $testsSkipped skipped');
  print('=' * 40);

  if (evalsFailed > 0 || testsFailed > 0) {
    print('');
    print('Check workspace/tasks/ for failure details.');
    exit(1);
  }

  exit(0);
}

class _EvalResult {
  final String relPath;
  final bool evalPassed;
  final bool testsPassed;
  final bool testsSkipped;

  _EvalResult({
    required this.relPath,
    required this.evalPassed,
    required this.testsPassed,
    required this.testsSkipped,
  });
}

Future<List<File>> _findEvals(Directory dir) async {
  final evals = <File>[];

  await for (final entity in dir.list(recursive: true)) {
    if (entity is File && entity.path.endsWith('/eval.dart')) {
      // Skip eval_base.dart and run_evals.dart
      if (entity.path.contains('eval_base.dart') ||
          entity.path.contains('run_evals.dart')) {
        continue;
      }
      // Skip tests/ folder
      if (entity.path.contains('/tests/')) {
        continue;
      }
      evals.add(entity);
    }
  }

  evals.sort((a, b) => a.path.compareTo(b.path));
  return evals;
}
