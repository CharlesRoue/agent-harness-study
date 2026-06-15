import type { ChapterExercises } from '../../types/exercise'

export const s01: ChapterExercises = {
  chapterId: 's01',
  exercises: [
    {
      id: 's01-q1', type: 'quiz', difficulty: '\u57FA\u7840',
      question: 'Agent Loop \u4E2D\uFF0C\u6A21\u578B\u505C\u6B62\u8C03\u7528\u5DE5\u5177\u65F6\uFF0C\u5FAA\u73AF\u901A\u8FC7\u4EC0\u4E48\u673A\u5236\u9000\u51FA\uFF1F',
      options: [
        '\u8BBE\u7F6E max_iterations \u8BA1\u6570\u5668',
        '\u68C0\u67E5 stop_reason \u662F\u5426\u4E0D\u7B49\u4E8E "tool_use"',
        '\u6355\u83B7 TimeoutError \u5F02\u5E38',
        '\u7B49\u5F85\u7528\u6237\u624B\u52A8\u505C\u6B62',
      ],
      correctIndex: 1,
      explanation: 'Agent Loop \u7684\u6838\u5FC3\u9000\u51FA\u6761\u4EF6\u975E\u5E38\u7B80\u5355\uFF1A\u5F53 response.stop_reason \u4E0D\u662F "tool_use" \u65F6\uFF0C\u8BF4\u660E\u6A21\u578B\u8BA4\u4E3A\u4EFB\u52A1\u5B8C\u6210\u4E86\uFF0C\u5FAA\u73AF\u901A\u8FC7 break \u9000\u51FA\u3002',
    },
    {
      id: 's01-q2', type: 'code_fill', difficulty: '\u57FA\u7840',
      question: '\u8865\u5168 Agent Loop \u7684\u6838\u5FC3\u9000\u51FA\u6761\u4EF6\uFF1A',
      codeBefore: 'while True:\n    response = client.messages.create(...)\n    messages.append({"role": "assistant", ...})\n    if response.',
      codeAfter: ' != "tool_use":\n        break\n    # execute tools...',
      answer: 'stop_reason',
      explanation: 'stop_reason \u662F LLM API \u54CD\u5E94\u4E2D\u7684\u5173\u952E\u5B57\u6BB5\u3002\u5F53\u503C\u4E3A "tool_use" \u65F6\u6A21\u578B\u8981\u6C42\u8C03\u7528\u5DE5\u5177\uFF0C\u5FAA\u73AF\u7EE7\u7EED\uFF1B\u5176\u4ED6\u503C\u8868\u793A\u6A21\u578B\u8BA4\u4E3A\u56DE\u7B54\u5B8C\u6BD5\u3002',
    },
    {
      id: 's01-q3', type: 'scenario', difficulty: '\u8FDB\u9636',
      scenario: '\u4F60\u6B63\u5728\u6784\u5EFA\u4E00\u4E2A Agent\uFF0C\u5B83\u5728\u6267\u884C\u5B8C\u5DE5\u5177\u540E\u76F4\u63A5\u7ED3\u675F\u5FAA\u73AF\uFF0C\u4E0D\u4F1A\u628A\u5DE5\u5177\u7ED3\u679C\u8FD4\u56DE\u7ED9\u6A21\u578B\u3002\u7528\u6237\u53D1\u73B0 Agent \u53EA\u80FD\u6267\u884C\u4E00\u6B65\u64CD\u4F5C\u5C31\u505C\u4E86\u3002\u95EE\u9898\u51FA\u5728\u54EA\u91CC\uFF1F',
      options: [
        { label: 's01 Agent Loop', description: '\u5FAA\u73AF\u6CA1\u6709\u628A tool_result \u8FFD\u52A0\u5230 messages \u5E76\u7EE7\u7EED\u8FED\u4EE3' },
        { label: 's02 Tool Use', description: '\u5DE5\u5177\u5B9A\u4E49\u6709\u8BEF\uFF0C\u6A21\u578B\u65E0\u6CD5\u6B63\u786E\u89E3\u6790' },
        { label: 's03 Permission', description: '\u6743\u9650\u7CFB\u7EDF\u963B\u6B62\u4E86\u540E\u7EED\u5DE5\u5177\u8C03\u7528' },
        { label: 's08 Context Compact', description: '\u4E0A\u4E0B\u6587\u6EA2\u51FA\u5BFC\u81F4\u6A21\u578B\u65E0\u6CD5\u7EE7\u7EED' },
      ],
      correctIndex: 0,
      explanation: 'Agent Loop \u7684\u5173\u952E\u4E0D\u4EC5\u662F\u201C\u5FAA\u73AF\u201D\uFF0C\u8FD8\u6709\u201C\u53CD\u9988\u201D\u2014\u2014\u6267\u884C\u5DE5\u5177\u540E\u5FC5\u987B\u5C06\u7ED3\u679C\u4F5C\u4E3A tool_result \u8FFD\u52A0\u5230 messages \u4E2D\uFF0C\u6A21\u578B\u624D\u80FD\u770B\u5230\u7ED3\u679C\u5E76\u51B3\u5B9A\u4E0B\u4E00\u6B65\u3002',
    },
  ],
}
