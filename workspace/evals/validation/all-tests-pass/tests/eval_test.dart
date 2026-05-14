import 'package:test/test.dart';
import '../eval.dart';

void main() {
  group('AllTestsPassEval', () {
    late AllTestsPassEval eval;

    setUp(() {
      eval = AllTestsPassEval();
    });

    test('discovers all test methods', () {
      final tests = eval.tests;
      expect(tests.keys, contains('test_all_tests_pass'));
      expect(tests.length, equals(1));
    });

    test('loads config from eval.json', () {
      expect(eval.config, isA<Map<String, dynamic>>());
    });

    test('test_all_tests_pass executes', () async {
      final (passed, violations) =
          await eval.tests['test_all_tests_pass']!();
      expect(passed, isA<bool>());
    });
  });
}
