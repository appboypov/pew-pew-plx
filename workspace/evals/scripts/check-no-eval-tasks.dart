import 'dart:io';

/// Pre-push validation script that checks for remaining eval task files.
/// Eval tasks are identified by having `type: task` and `eval:` in frontmatter.
/// Exit code 0 = no eval tasks, 1 = eval tasks remain.
void main() async {
  final projectRoot = _findProjectRoot();
  final tasksDir = Directory('${projectRoot.path}/workspace/tasks');

  if (!tasksDir.existsSync()) {
    print('No eval tasks found.');
    exit(0);
  }

  final evalTasks = <String>[];

  await for (final entity in tasksDir.list()) {
    if (entity is! File) continue;
    if (!entity.path.endsWith('.md')) continue;

    final content = entity.readAsStringSync();
    final frontmatter = _parseFrontmatter(content);

    if (frontmatter['type'] == 'task' && frontmatter.containsKey('eval')) {
      final relPath = entity.path.replaceFirst('${projectRoot.path}/', '');
      evalTasks.add('  - $relPath (eval: ${frontmatter['eval']})');
    }
  }

  if (evalTasks.isEmpty) {
    print('No eval tasks found.');
    exit(0);
  }

  print('Eval tasks remain:');
  for (final task in evalTasks) {
    print(task);
  }
  print('');
  print('Fix violations before pushing.');
  exit(1);
}

Directory _findProjectRoot() {
  var current = Directory(Platform.script.toFilePath()).parent;
  while (current.path != current.parent.path) {
    final claudeMd = File('${current.path}/CLAUDE.md');
    if (claudeMd.existsSync()) {
      return current;
    }
    current = current.parent;
  }
  return Directory.current;
}

Map<String, String> _parseFrontmatter(String content) {
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
