import 'dart:convert';
import 'dart:io';

/// Result of a single test.
typedef TestResult = (bool passed, String? violations);

/// A test function that returns pass/fail with optional violations.
typedef TestFunction = Future<TestResult> Function();

/// Base class for all evals.
///
/// Provides common functionality for:
/// - Running multiple test methods and aggregating results
/// - Creating failure tasks in workspace/tasks/
/// - Cleaning up old tasks on pass
/// - Loading configuration from eval.json
abstract class BaseEval {
  /// The project root directory (containing workspace/)
  late final Directory projectRoot;

  /// The tasks directory
  late final Directory tasksDir;

  /// The eval directory (where eval.dart lives)
  late final Directory evalDir;

  /// Configuration loaded from eval.json
  late final Map<String, dynamic> config;

  BaseEval() {
    evalDir = Directory(Platform.script.toFilePath()).parent;
    config = _loadConfig();
    projectRoot = _findProjectRoot();
    tasksDir = Directory('${projectRoot.path}/workspace/tasks');
  }

  /// Eval name (kebab-case). Loaded from config or override.
  String get name => config['name'] as String? ?? evalDir.path.split('/').last;

  /// Category folder name. Loaded from config or override.
  String get category =>
      config['category'] as String? ?? evalDir.parent.path.split('/').last;

  /// Description of what this eval checks. Loaded from config or override.
  String get description => config['description'] as String? ?? '';

  /// Task template configuration from eval.json.
  Map<String, dynamic> get taskTemplate =>
      config['task_template'] as Map<String, dynamic>? ?? {};

  Map<String, dynamic> _loadConfig() {
    final configFile = File('${evalDir.path}/eval.json');
    if (configFile.existsSync()) {
      try {
        return jsonDecode(configFile.readAsStringSync()) as Map<String, dynamic>;
      } catch (e) {
        print('Warning: Failed to parse eval.json: $e');
        return {};
      }
    }
    return {};
  }

  Directory _findProjectRoot() {
    var current = evalDir;
    while (current.path != current.parent.path) {
      final claudeMd = File('${current.path}/CLAUDE.md');
      if (claudeMd.existsSync()) {
        return current;
      }
      current = current.parent;
    }
    return Directory.current;
  }

  /// Map of test names to test functions.
  /// Override this to provide multiple tests.
  /// Each test should return (true, null) for pass or (false, "violations") for fail.
  Map<String, TestFunction> get tests => {};

  /// Run the eval and return exit code (0 = pass, 1 = fail)
  Future<int> run() async {
    print('=' * 40);
    print('Running eval: $name');
    print('=' * 40);
    print('');

    final testMap = tests;
    if (testMap.isEmpty) {
      print('WARNING: No tests defined!');
      print('Override the `tests` getter to provide test functions.');
      return 1;
    }

    final allViolations = <Map<String, dynamic>>[];
    var passed = 0;
    var failed = 0;

    final sortedTests = testMap.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));

    for (final entry in sortedTests) {
      final testName = entry.key;
      final testFn = entry.value;

      stdout.write('  [$testName]... ');

      try {
        final (testPassed, violations) = await testFn();

        if (testPassed) {
          print('PASS');
          passed++;
        } else {
          print('FAIL');
          failed++;
          allViolations.add({
            'test': testName,
            'violations': violations ?? 'Unknown failure',
          });
        }
      } catch (e, stack) {
        print('ERROR');
        failed++;
        allViolations.add({
          'test': testName,
          'violations': 'Exception: $e\n$stack',
        });
      }
    }

    print('');
    print('=' * 40);
    print('Results: $passed passed, $failed failed');
    print('=' * 40);

    if (failed > 0) {
      print('');
      print('FAIL: $name');
      await _createFailureTask(allViolations);
      return 1;
    } else {
      print('');
      print('PASS: $name');
      await _cleanupOldTask();
      return 0;
    }
  }

  String _formatViolations(List<Map<String, dynamic>> violations) {
    final lines = <String>[];
    for (final v in violations) {
      lines.add('=== ${v['test']} ===');
      if (v['violations'] != null) {
        lines.add(v['violations'] as String);
      }
      lines.add('');
    }
    return lines.join('\n');
  }

  Future<void> _createFailureTask(List<Map<String, dynamic>> violations) async {
    await tasksDir.create(recursive: true);
    final taskFile = File('${tasksDir.path}/$name.md');

    final template = taskTemplate;
    final sections = template['sections'] as Map<String, dynamic>? ?? {};

    final taskName =
        template['name'] as String? ?? 'Fix $name eval violations';
    final should = sections['should'] as String? ??
        'Fix the violations listed above.';
    final endGoal = sections['end_goal'] as String? ??
        'All $name eval tests pass.';
    final acceptanceCriteria =
        (sections['acceptance_criteria'] as List<dynamic>?)?.cast<String>() ??
            [
              'All violations are fixed',
              'Eval passes: `dart workspace/evals/$category/$name/eval.dart`',
            ];
    final suggestedApproach =
        (sections['suggested_approach'] as List<dynamic>?)?.cast<String>() ??
            [
              'Review each violation',
              'Fix the underlying issue',
              'Re-run eval to verify',
            ];

    final violationsText = _formatViolations(violations);

    final content = '''---
name: $taskName
description: $description
status: to-do
type: task
eval: @workspace/evals/$category/$name/eval.md
script: @workspace/evals/$category/$name/eval.dart
---

## Script Output

```text
$violationsText
```

## Should

$should

## End Goal

$endGoal

## Acceptance Criteria

${acceptanceCriteria.map((c) => '- [ ] $c').join('\n')}

## Suggested Approach

${suggestedApproach.map((s) => '- [ ] $s').join('\n')}
''';

    await taskFile.writeAsString(content);
    print('Created task: ${taskFile.path}');
  }

  Future<void> _cleanupOldTask() async {
    final taskFile = File('${tasksDir.path}/$name.md');
    if (await taskFile.exists()) {
      await taskFile.delete();
      print('Cleaned up old task: ${taskFile.path}');
    }
  }
}

/// Creates a temporary directory for testing
Future<Directory> createTempDir() async {
  return Directory.systemTemp.createTemp('eval_');
}

/// Cleans up a temporary directory
Future<void> cleanupTempDir(Directory dir) async {
  if (await dir.exists()) {
    await dir.delete(recursive: true);
  }
}

/// Parses YAML frontmatter from markdown content
Map<String, String> parseFrontmatter(String content) {
  final lines = content.split('\n');
  if (lines.isEmpty || lines.first.trim() != '---') {
    return {};
  }

  final frontmatter = <String, String>{};
  for (var i = 1; i < lines.length; i++) {
    final line = lines[i].trim();
    if (line == '---') break;
    if (line.contains(':')) {
      final colonIndex = line.indexOf(':');
      final key = line.substring(0, colonIndex).trim();
      final value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}
